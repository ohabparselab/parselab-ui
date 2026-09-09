import "./dom-shim.js";
import { render as preactRender, type ComponentChild } from "preact";

/**
 * Base class for @parselab/ui custom elements: renders Preact into a
 * shadow root and defines properties as native `accessor` class fields
 * via `reflect()` below — the same architecture @shopify/ui-extensions
 * describes for its own components (Preact rendering into shadow DOM,
 * `accessor` properties that "reflect as both DOM properties and
 * attributes"). Shopify's actual internal implementation isn't published
 * (only its compiled `.d.ts` type shape is), so this is our own from-
 * scratch implementation of that same contract using standard (TC39)
 * decorators, not a port of their code.
 */
export abstract class PreactCustomElement extends HTMLElement {
  static styles?: string;

  static get observedAttributes(): string[] {
    return [...(attributesByClass.get(this)?.keys() ?? [])];
  }

  #upgraded = false;
  #renderScheduled = false;
  #reflectingAttribute: string | null = null;

  connectedCallback() {
    if (!this.#upgraded) {
      this.#upgraded = true;

      const shadow = this.attachShadow({ mode: "open" });
      const styles = (this.constructor as typeof PreactCustomElement).styles;
      if (styles) {
        shadow.adoptedStyleSheets = [getStyleSheet(this.constructor, styles)];
      }

      // Attributes present in static HTML win over the class's hardcoded
      // defaults (which already ran, and already reflected themselves
      // back onto the attribute, during construction) — read them back
      // now, before the very first render.
      const registry = attributesByClass.get(this.constructor);
      if (registry) {
        for (const [attrName, entry] of registry) {
          if (this.hasAttribute(attrName)) {
            (this as unknown as Record<string, unknown>)[entry.propertyName] =
              entry.converter.fromAttribute(this.getAttribute(attrName));
          }
        }
      }
    }
    this.requestUpdate();
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (!this.#upgraded || this.#reflectingAttribute === name) return;
    const entry = attributesByClass.get(this.constructor)?.get(name);
    if (!entry) return;
    (this as unknown as Record<string, unknown>)[entry.propertyName] =
      entry.converter.fromAttribute(value);
  }

  /** Marks a re-render as needed; batches multiple property writes made in the same tick into a single Preact render pass. */
  requestUpdate() {
    if (this.#renderScheduled || !this.isConnected) return;
    this.#renderScheduled = true;
    queueMicrotask(() => {
      this.#renderScheduled = false;
      if (this.isConnected && this.shadowRoot) {
        preactRender(this.render(), this.shadowRoot);
      }
    });
  }

  /** Sets/removes an attribute to mirror a property write, without re-triggering attributeChangedCallback recursively. */
  reflectAttribute(name: string, value: string | null) {
    this.#reflectingAttribute = name;
    if (value === null) this.removeAttribute(name);
    else this.setAttribute(name, value);
    this.#reflectingAttribute = null;
  }

  abstract render(): ComponentChild;
}

export interface AttributeConverter<T> {
  toAttribute(value: T): string | null;
  fromAttribute(value: string | null): T;
}

/** Reflects strings/enums as-is; empty string removes the attribute. */
export const stringConverter: AttributeConverter<string> = {
  toAttribute: (v) => (v === "" || v == null ? null : v),
  fromAttribute: (v) => v ?? "",
};

/** Reflects booleans as attribute presence (like `disabled`), not `"true"`/`"false"` strings. */
export const booleanConverter: AttributeConverter<boolean> = {
  toAttribute: (v) => (v ? "" : null),
  fromAttribute: (v) => v !== null,
};

interface ReflectOptions<T> {
  /** Attribute name; defaults to the kebab-case form of the property name. Pass `false` to disable attribute reflection for this property. */
  attribute?: string | false;
  converter?: AttributeConverter<T>;
}

function toKebabCase(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

type AccessorTarget<C, V> = {
  get(this: C): V;
  set(this: C, value: V): void;
};

/**
 * Standard (TC39) accessor decorator: gives a class field DOM property +
 * attribute reflection, and schedules a re-render on every write. Applied
 * to `accessor` fields, e.g. `@reflect() accessor variant = 'secondary';`.
 *
 * Property→attribute reflection (this decorator) and attribute→property
 * sync (`PreactCustomElement.attributeChangedCallback`, driven by the
 * registry this decorator populates) are two separate mechanisms working
 * together — see `attributesByClass` below for why registration happens
 * synchronously here rather than lazily.
 */
export function reflect<T>(options: ReflectOptions<T> = {}) {
  return function (
    target: AccessorTarget<PreactCustomElement, T>,
    context: ClassAccessorDecoratorContext<PreactCustomElement, T>,
  ): AccessorTarget<PreactCustomElement, T> {
    const propertyName = String(context.name);
    const attributeName =
      options.attribute === false ? undefined : (options.attribute ?? toKebabCase(propertyName));
    const converter = (options.converter ?? stringConverter) as AttributeConverter<T>;

    // Member decorators run synchronously, top-to-bottom, while the class
    // body is being evaluated — i.e. before `customElement()` (a class
    // decorator, which always runs last) defines the element and before
    // any instance exists. Registering here (not in `context.addInitializer`,
    // which only runs per-instance) is what lets `observedAttributes` be
    // correct by the time `customElements.define()` actually runs.
    if (attributeName) {
      pendingAttributes.set(attributeName, { propertyName, converter });
    }

    return {
      get(this: PreactCustomElement) {
        return target.get.call(this);
      },
      set(this: PreactCustomElement, value: T) {
        target.set.call(this, value);
        if (attributeName) {
          this.reflectAttribute(attributeName, converter.toAttribute(value));
        }
        this.requestUpdate();
      },
    };
  };
}

interface AttributeRegistryEntry {
  propertyName: string;
  converter: AttributeConverter<unknown>;
}

// Accumulates `reflect()` registrations for whichever class is currently
// being defined; `customElement()` below claims and resets this when the
// class decorator runs (always after all member decorators, in one
// synchronous pass — see MDN's class evaluation order for decorators).
let pendingAttributes = new Map<string, AttributeRegistryEntry>();

const attributesByClass = new WeakMap<Function, Map<string, AttributeRegistryEntry>>();
const styleSheetCache = new WeakMap<Function, CSSStyleSheet>();

function getStyleSheet(ctor: Function, cssText: string): CSSStyleSheet {
  let sheet = styleSheetCache.get(ctor);
  if (!sheet) {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    styleSheetCache.set(ctor, sheet);
  }
  return sheet;
}

/**
 * Class decorator: claims this class's `reflect()`-registered attributes
 * and registers the custom element, mirroring Lit's `@customElement()` /
 * Shopify's own (unpublished) element-registration mechanism.
 */
export function customElement(tagName: string) {
  return function <T extends CustomElementConstructor>(
    target: T,
    context: ClassDecoratorContext<T>,
  ): void {
    attributesByClass.set(target, pendingAttributes);
    pendingAttributes = new Map();
    context.addInitializer(function () {
      if (!customElements.get(tagName)) {
        customElements.define(tagName, target);
      }
    });
  };
}
