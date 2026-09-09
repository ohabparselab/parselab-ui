import "../../internal/dom-shim.js";
import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./button.styles.js";
import type { ButtonProps } from "./button.types.js";

export const tagName = "p-button";

/**
 * `<p-button>` — Parselab UI's Button.
 *
 * Mirrors Shopify's `<s-button>` prop surface (variant/tone/loading/href)
 * but is a real, framework-agnostic custom element built with Lit.
 *
 * @element p-button
 *
 * @prop {'primary'|'secondary'|'tertiary'|'plain'} variant - Visual weight. Default 'secondary'.
 * @prop {'neutral'|'critical'|'auto'} tone - Semantic tone. Default 'auto'.
 * @prop {boolean} disabled - Disables the button.
 * @prop {boolean} loading - Shows a spinner and disables interaction.
 * @prop {string} href - Renders the button as a link when set.
 * @prop {string} accessibilityLabel - Accessible label, maps to aria-label.
 *
 * @fires click - Standard click event; not fired while disabled or loading.
 *
 * @csspart base - The internal <button> or <a> element.
 *
 * @cssprop --p-color-primary - Background color for variant="primary".
 * @cssprop --p-radius-md - Corner radius.
 */
@customElement(tagName)
export class PButton extends LitElement implements ButtonProps {
  static styles = styles;

  @property({ reflect: true }) variant: ButtonProps["variant"] = "secondary";

  @property({ reflect: true }) tone: ButtonProps["tone"] = "auto";

  @property() icon?: string;

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: Boolean, reflect: true }) loading = false;

  @property() href?: string;

  @property() target?: ButtonProps["target"];

  @property() download?: string;

  @property() type: ButtonProps["type"] = "button";

  @property({ attribute: "accessibility-label" }) accessibilityLabel?: string;

  private handleClick(event: MouseEvent) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  render() {
    const label = this.accessibilityLabel ?? nothing;
    const spinner = this.loading
      ? html`<span class="spinner" part="spinner" aria-hidden="true"></span>`
      : nothing;

    if (this.href && !this.disabled) {
      return html`<a
        part="base"
        href=${this.href}
        target=${this.target || nothing}
        download=${this.download || nothing}
        aria-label=${label}
        @click=${this.handleClick}
      >
        ${spinner}<slot></slot>
      </a>`;
    }

    return html`<button
      part="base"
      type=${this.type}
      ?disabled=${this.disabled || this.loading}
      aria-label=${label}
      aria-busy=${this.loading ? "true" : nothing}
      @click=${this.handleClick}
    >
      ${spinner}<slot></slot>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: PButton;
  }
}
