import { h, type ComponentChild } from "preact";
import {
  PreactCustomElement,
  reflect,
  customElement,
  booleanConverter,
} from "../../internal/preact-custom-element.js";
import styles from "./button.styles.js";
import type { ButtonProps } from "./button.types.js";

export const tagName = "p-button";

/**
 * `<p-button>` — Parselab UI's Button.
 *
 * Mirrors Shopify's `<s-button>` prop surface (variant/tone/loading/href/
 * command/commandFor/interestFor/lang), built with Preact rendering into
 * a shadow root and `accessor`-based property reflection — the same
 * architecture @shopify/ui-extensions uses internally, reimplemented from
 * scratch for `p-*` elements (see internal/preact-custom-element.ts).
 *
 * `.onclick` / `.onblur` / `.onfocus` work out of the box via the
 * inherited native `HTMLElement.GlobalEventHandlers` — not reimplemented
 * here; only the React-facing `onClick`/`onFocus`/`onBlur` callback shape
 * is a `@parselab/ui` addition (see button.types.ts).
 *
 * @element p-button
 *
 * @prop {'primary'|'secondary'|'tertiary'|'plain'} variant - Visual weight. Default 'secondary'.
 * @prop {'neutral'|'critical'|'auto'} tone - Semantic tone. Default 'auto'.
 * @prop {boolean} disabled - Disables the button.
 * @prop {boolean} loading - Shows a spinner and disables interaction.
 * @prop {string} href - Renders the button as a link when set.
 * @prop {string} accessibilityLabel - Accessible label, maps to aria-label.
 * @prop {string} lang - BCP 47 language tag.
 * @prop {string} command - Invoker Commands action for the element referenced by commandFor.
 * @prop {string} commandFor - id of the component this button controls (e.g. a future Modal).
 * @prop {string} interestFor - id of the component to signal interest in.
 *
 * @fires click - Standard click event; not fired while disabled or loading.
 *
 * @csspart base - The internal <button> or <a> element.
 * @csspart spinner - The loading spinner, present only while `loading`.
 *
 * @cssprop --p-color-primary - Background color for variant="primary".
 * @cssprop --p-radius-md - Corner radius.
 */
@customElement(tagName)
export class PButton extends PreactCustomElement implements ButtonProps {
  static styles = styles;

  @reflect() accessor variant: ButtonProps["variant"] = "secondary";

  @reflect() accessor tone: ButtonProps["tone"] = "auto";

  @reflect() accessor icon = "";

  @reflect({ converter: booleanConverter }) accessor disabled = false;

  @reflect({ converter: booleanConverter }) accessor loading = false;

  @reflect() accessor href = "";

  @reflect() accessor target: ButtonProps["target"] = "";

  @reflect() accessor download = "";

  @reflect() accessor type: ButtonProps["type"] = "button";

  @reflect({ attribute: "accessibility-label" }) accessor accessibilityLabel = "";

  @reflect() accessor lang = "";

  @reflect() accessor command: ButtonProps["command"] = "--auto";

  @reflect({ attribute: "commandfor" }) accessor commandFor = "";

  @reflect({ attribute: "interestfor" }) accessor interestFor = "";

  #handleClick = (event: MouseEvent) => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  render(): ComponentChild {
    const label = this.accessibilityLabel || undefined;
    const spinner = this.loading
      ? h("span", { class: "spinner", part: "spinner", "aria-hidden": "true" })
      : null;

    // Forwarded onto the rendered element as raw HTML attributes so that,
    // once a component implementing the receiving end (e.g. Modal) exists,
    // this works via the browser's native Invoker Commands API with no
    // extra glue code on our side — see internal/shared.ts.
    const commandAttrs = this.commandFor
      ? { command: this.command, commandfor: this.commandFor }
      : {};
    const interestAttrs = this.interestFor ? { interestfor: this.interestFor } : {};

    if (this.href && !this.disabled) {
      return h(
        "a",
        {
          part: "base",
          href: this.href,
          target: this.target || undefined,
          download: this.download || undefined,
          "aria-label": label,
          onClick: this.#handleClick,
        },
        spinner,
        h("slot", null),
      );
    }

    return h(
      "button",
      {
        part: "base",
        type: this.type,
        disabled: this.disabled || this.loading,
        "aria-label": label,
        "aria-busy": this.loading ? "true" : undefined,
        onClick: this.#handleClick,
        ...commandAttrs,
        ...interestAttrs,
      },
      spinner,
      h("slot", null),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: PButton;
  }
}
