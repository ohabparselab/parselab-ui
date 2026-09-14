// Plain CSS text, applied via a constructable stylesheet in
// PreactCustomElement (see internal/preact-custom-element.ts) — no Lit
// `css` tagged template needed since components no longer use Lit.
//
// Visual design matches Shopify Polaris's own default button (see
// tokens.css for the sourced token values this reads from).
export default `
  :host {
    display: inline-block;
    font-family: var(--p-font-family, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
    font-size: var(--p-font-size-base, 0.75rem);
  }

  :host([hidden]) {
    display: none;
  }

  [part="base"] {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    box-sizing: border-box;
    min-height: var(--_min-height);
    border: 1px solid transparent;
    border-radius: var(--_radius);
    padding: var(--_padding-block) var(--_padding-inline);
    font: inherit;
    font-weight: var(--p-font-weight-medium, 550);
    line-height: 1rem;
    cursor: pointer;
    background: var(--_bg);
    color: var(--_color);
    border-color: var(--_border-color);
    box-shadow: var(--_shadow, none);
    transition: background var(--p-transition-fast, 120ms ease),
      border-color var(--p-transition-fast, 120ms ease),
      color var(--p-transition-fast, 120ms ease);
  }

  [part="base"]:hover:not(:disabled) {
    background: var(--_bg-hover);
    border-color: var(--_border-color-hover, var(--_border-color));
    color: var(--_color-hover, var(--_color));
  }

  [part="base"]:active:not(:disabled) {
    background: var(--_bg-active, var(--_bg-hover));
    color: var(--_color-active, var(--_color-hover, var(--_color)));
  }

  [part="base"]:focus-visible {
    outline: 2px solid var(--p-color-focus-ring, #005bd3);
    outline-offset: 1px;
  }

  [part="base"]:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* --- base sizing tokens --- */
  :host {
    --_radius: var(--p-radius-md, 8px);
    --_padding-block: var(--p-space-small, 0.375rem);
    --_padding-inline: var(--p-space-large, 0.75rem);
    --_min-height: 2rem;
    --_shadow: none;
  }

  /* --- variant: primary --- */
  :host([variant="primary"]) {
    --_bg: var(--p-color-primary, #303030);
    --_bg-hover: var(--p-color-primary-hover, #1a1a1a);
    --_bg-active: var(--p-color-primary-active, #1a1a1a);
    --_color: var(--p-color-text-on-primary, #fff);
    --_border-color: transparent;
    --_shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.4);
  }

  /* --- variant: secondary (default) --- */
  :host([variant="secondary"]),
  :host(:not([variant])) {
    --_bg: var(--p-color-neutral, #fff);
    --_bg-hover: var(--p-color-neutral-hover, #fafafa);
    --_bg-active: var(--p-color-neutral-active, #f7f7f7);
    --_color: var(--p-color-text, #303030);
    --_border-color: var(--p-color-border, #e3e3e3);
    --_border-color-hover: var(--p-color-border-hover, #ccc);
    --_shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  }

  /* --- variant: tertiary --- */
  :host([variant="tertiary"]) {
    --_bg: transparent;
    --_bg-hover: var(--p-color-surface-hover, rgba(0, 0, 0, 0.06));
    --_bg-active: var(--p-color-surface-active, rgba(0, 0, 0, 0.1));
    --_color: var(--p-color-text, #303030);
    --_border-color: transparent;
  }

  /* --- variant: plain --- */
  :host([variant="plain"]) {
    --_bg: transparent;
    --_bg-hover: transparent;
    --_color: var(--p-color-primary, #303030);
    --_border-color: transparent;
  }
  :host([variant="plain"]) [part="base"] {
    min-height: auto;
    padding-inline: 0;
    text-decoration: underline;
  }

  /* --- tone: critical --- */
  :host([tone="critical"][variant="primary"]) {
    --_bg: var(--p-color-critical, #c70a24);
    --_bg-hover: var(--p-color-critical-hover, #a30a24);
    --_bg-active: var(--p-color-critical-active, #8e0b21);
    --_shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  }
  :host([tone="critical"]:not([variant="primary"])) {
    --_color: var(--p-color-critical-text, #8e0b21);
    --_color-hover: var(--p-color-critical-text-hover, #5f0716);
    --_color-active: var(--p-color-critical-text-active, #2f040b);
  }

  .spinner {
    width: 0.9em;
    height: 0.9em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: p-button-spin 0.6s linear infinite;
  }

  @keyframes p-button-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
