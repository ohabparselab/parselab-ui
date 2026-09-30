import {
  onRegister,
  registeredComponents,
  type RegisteredComponent,
} from "./registry";

export const TAG_NAME = "parse-ui";

/**
 * Defines `<parse-ui>`. Wrapped in a function (instead of a top-level
 * `class … extends HTMLElement`) so importing this module during SSR, where
 * `HTMLElement` doesn't exist, doesn't throw.
 */
export function defineParseUIElement(): void {
  if (customElements.get(TAG_NAME)) return;

  const nativeFirstChild = Object.getOwnPropertyDescriptor(Node.prototype, "firstChild")!.get!;

  // Each element's content container, for the forwarded accessors defined
  // on the prototype below (they can't reach the class's #private fields).
  const contentOf = new WeakMap<HTMLElement, HTMLElement>();

  class ParseUIElement extends HTMLElement {
    #root: ShadowRoot;
    #content: HTMLElement;
    #applied = new Set<string>();
    #unsubscribe?: () => void;
    #observer: MutationObserver;

    constructor() {
      super();
      this.#root = this.attachShadow({ mode: "open" });
      // Children live in this container rather than directly in the shadow
      // root, so fallback <style> elements (browsers without constructable
      // stylesheets) never show up among the "children" frameworks see.
      this.#content = document.createElement("div");
      this.#content.className = "parse-ui-content";
      this.#content.setAttribute("part", "content");
      this.#root.appendChild(this.#content);
      contentOf.set(this, this.#content);
      this.#observer = new MutationObserver(() => this.#moveLightChildren());
    }

    connectedCallback(): void {
      registeredComponents().forEach((entry) => this.#apply(entry));
      this.#unsubscribe ??= onRegister((entry) => this.#apply(entry));
      this.#moveLightChildren();
      // A <head> script defines this element before the parser has appended
      // its children, and anything can still insert into the host directly
      // (e.g. Element.prototype.appendChild.call(host, …)) — catch those too.
      this.#observer.observe(this, { childList: true });
    }

    disconnectedCallback(): void {
      this.#observer.disconnect();
      this.#unsubscribe?.();
      this.#unsubscribe = undefined;
    }

    #apply(entry: RegisteredComponent): void {
      const { name, css, setup } = entry.definition;
      if (this.#applied.has(name)) return;
      this.#applied.add(name);

      if (entry.sheet) {
        this.#root.adoptedStyleSheets = [...this.#root.adoptedStyleSheets, entry.sheet];
      } else if (css) {
        const style = document.createElement("style");
        style.dataset.parseui = name;
        style.textContent = css;
        this.#root.insertBefore(style, this.#content);
      }

      setup?.(this.#root);
    }

    #moveLightChildren(): void {
      let node: Node | null;
      while ((node = nativeFirstChild.call(this))) this.#content.appendChild(node);
    }

    // --- Child-list methods forwarded to the shadow content, so React/Vue
    // (which keep inserting/removing children on this element after the
    // children have moved) operate on the real location of those nodes. ---

    appendChild<T extends Node>(node: T): T {
      return this.#content.appendChild(node);
    }

    insertBefore<T extends Node>(node: T, child: Node | null): T {
      return this.#content.insertBefore(node, child);
    }

    removeChild<T extends Node>(child: T): T {
      return child.parentNode === this.#content
        ? this.#content.removeChild(child)
        : super.removeChild(child);
    }

    replaceChild<T extends Node>(node: Node, child: T): T {
      return child.parentNode === this.#content
        ? this.#content.replaceChild(node, child)
        : super.replaceChild(node, child);
    }

    append(...nodes: (Node | string)[]): void {
      this.#content.append(...nodes);
    }

    prepend(...nodes: (Node | string)[]): void {
      this.#content.prepend(...nodes);
    }

    replaceChildren(...nodes: (Node | string)[]): void {
      this.#content.replaceChildren(...nodes);
    }

    hasChildNodes(): boolean {
      return this.#content.hasChildNodes();
    }
  }

  // Accessors are declared as plain properties in lib.dom.d.ts, so they
  // can't be overridden with class-body getters in TypeScript — define them
  // on the prototype instead.
  const forwardGetter = (name: string) => ({
    configurable: true,
    get(this: HTMLElement) {
      return (contentOf.get(this) as unknown as Record<string, unknown>)[name];
    },
  });
  const forwardAccessor = (name: string) => ({
    ...forwardGetter(name),
    set(this: HTMLElement, value: unknown) {
      (contentOf.get(this) as unknown as Record<string, unknown>)[name] = value;
    },
  });

  Object.defineProperties(ParseUIElement.prototype, {
    childNodes: forwardGetter("childNodes"),
    children: forwardGetter("children"),
    firstChild: forwardGetter("firstChild"),
    lastChild: forwardGetter("lastChild"),
    firstElementChild: forwardGetter("firstElementChild"),
    lastElementChild: forwardGetter("lastElementChild"),
    childElementCount: forwardGetter("childElementCount"),
    textContent: forwardAccessor("textContent"),
    innerHTML: forwardAccessor("innerHTML"),
  });

  customElements.define(TAG_NAME, ParseUIElement);
}
