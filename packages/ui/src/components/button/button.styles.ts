// Plain CSS text, applied via a constructable stylesheet in
// PreactCustomElement (see internal/preact-custom-element.ts) — no Lit
// `css` tagged template needed since components no longer use Lit.
//
// Visual design matches Shopify Polaris's real `<s-button>` — box-shadow,
// gradient, and color values below are copied from its actual compiled
// CSS (see tokens.css for where the token values themselves come from).
export default `
  :host {
    display: inline-block;
    font-family: var(--p-font-family, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
    font-size: var(--p-font-size-base, 0.75rem);
  }

  :host([hidden]) {
    display: none;
  }

  /* No real border anywhere — every variant simulates its border (or
     doesn't have one) purely via box-shadow below, matching Shopify's
     own s-button exactly. A real border *and* an inset box-shadow ring
     at the same edge double up into a visibly thicker, always-on gray
     line — a border that's meant to be shadow-only can't be turned off
     per variant/state by only changing --_shadow. */
  [part="base"] {
    text-decoration: none;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-height: var(--_min-height);
    border: none;
    border-radius: var(--_radius);
    padding: var(--_padding-block) var(--_padding-inline);
    font: inherit;
    font-weight: var(--p-font-weight-medium, 550);
    line-height: 1rem;
    cursor: pointer;
    background-color: var(--_bg);
    background-image: var(--_bg-image, none);
    color: var(--_color);
    box-shadow: var(--_shadow, none);
    transition: background-color var(--p-transition-fast, 120ms ease),
      color var(--p-transition-fast, 120ms ease),
      box-shadow var(--p-transition-fast, 120ms ease);
  }

  .content {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    transition: transform var(--p-transition-fast, 120ms ease), color var(--p-transition-fast, 120ms ease);
  }

  /* Pressed state: the label shifts down 1px, independent of the border/
     shadow around it, simulating the surface being pushed in — same
     affordance Polaris's own buttons use for :active. Tertiary/plain have
     no depth to push into (flat, borderless), so they opt out. */
  [part="base"]:active:not(:disabled) .content {
    transform: translate3d(0, 1px, 0);
  }
  :host([variant="tertiary"]) [part="base"]:active:not(:disabled) .content,
  :host([variant="plain"]) [part="base"]:active:not(:disabled) .content {
    transform: none;
  }

  [part="base"]:hover:not(:disabled) {
    background-color: var(--_bg-hover);
    background-image: var(--_bg-image-hover, var(--_bg-image, none));
    box-shadow: var(--_shadow-hover, var(--_shadow, none));
  }
  [part="base"]:hover:not(:disabled) .content {
    color: var(--_color-hover, var(--_color));
  }

  [part="base"]:active:not(:disabled) {
    background-color: var(--_bg-active, var(--_bg-hover));
    background-image: none;
    box-shadow: var(--_shadow-active, var(--_shadow, none));
  }
  [part="base"]:active:not(:disabled) .content {
    color: var(--_color-active, var(--_color-hover, var(--_color)));
  }

  [part="base"]:focus-visible {
    background-color: var(--_bg-hover);
    background-image: var(--_bg-image-hover, var(--_bg-image, none));
    outline: 2px solid var(--p-color-focus-ring, #005bd3);
    outline-offset: 1px;
  }
  [part="base"]:focus-visible .content {
    color: var(--_color-hover, var(--_color));
  }

  [part="base"]:disabled {
    cursor: not-allowed;
    background-color: var(--_bg-disabled, var(--_bg));
    background-image: none;
    box-shadow: none;
    color: var(--_color-disabled, var(--_color));
  }

  /* While loading, the label turns transparent rather than disappearing —
     the button keeps its width — and the spinner (absolutely positioned,
     so it doesn't affect layout) sits centered on top of it. */
  :host([loading]) .content {
    color: transparent;
  }

  /* Always a neutral gray, regardless of variant/tone — loading reads as
     a muted state rather than inheriting e.g. primary's white or
     critical's red, matching Shopify's own <s-button>. */
  .spinner {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 0.9em;
    height: 0.9em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    color: var(--p-color-text-disabled, #b5b5b5);
    animation: p-button-spin 0.6s linear infinite;
  }

  /* --- base sizing tokens --- */
  :host {
    --_radius: var(--p-radius-md, 8px);
    --_padding-block: var(--p-space-small, 0.375rem);
    --_padding-inline: var(--p-space-large, 0.75rem);
    --_min-height: 2rem;
  }

  /* --- variant: primary --- */
  :host([variant="primary"]) {
    --_bg: var(--p-color-primary, #303030);
    --_bg-hover: var(--p-color-primary-hover, #1a1a1a);
    --_bg-active: var(--p-color-primary-active, #1a1a1a);
    --_bg-image: linear-gradient(180deg, rgba(48, 48, 48, 0) 63.53%, rgba(255, 255, 255, 0.15) 100%);
    --_color: var(--p-color-text-on-primary, #fff);
    --_color-hover: var(--p-color-text-on-primary-hover, #e3e3e3);
    --_color-active: var(--p-color-text-on-primary-active, #ccc);
    --_shadow: inset 0 -1px 0 1px rgba(0, 0, 0, 0.8), inset 0 0 0 1px #303030,
      inset 0 0.5px 0 1.5px rgba(255, 255, 255, 0.25);
    --_shadow-active: inset 0 3px 0 0 #000;
    --_bg-disabled: var(--p-color-primary-disabled, rgba(0, 0, 0, 0.17));
    --_color-disabled: var(--p-color-text-on-primary, #fff);
  }

  /* --- variant: secondary (default) --- */
  :host([variant="secondary"]),
  :host(:not([variant])) {
    --_bg: var(--p-color-neutral, #fff);
    --_bg-hover: var(--p-color-neutral-hover, #fafafa);
    --_bg-active: var(--p-color-neutral-active, #f7f7f7);
    --_color: var(--p-color-text, #303030);
    --_shadow: inset 0 -1px 0 0 #b5b5b5, inset 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0.5px 0 1.5px #fff;
    --_shadow-active: inset -1px 0 1px 0 rgba(26, 26, 26, 0.122), inset 1px 0 1px 0 rgba(26, 26, 26, 0.122),
      inset 0 2px 1px 0 rgba(26, 26, 26, 0.2);
    --_bg-disabled: var(--p-color-neutral-disabled, rgba(0, 0, 0, 0.05));
    --_color-disabled: var(--p-color-text-disabled, #b5b5b5);
  }

  /* --- variant: tertiary --- */
  :host([variant="tertiary"]) {
    --_bg: transparent;
    --_bg-hover: var(--p-color-surface-hover, rgba(0, 0, 0, 0.05));
    --_bg-active: var(--p-color-surface-active, rgba(0, 0, 0, 0.08));
    --_color: var(--p-color-text, #303030);
    --_bg-disabled: transparent;
    --_color-disabled: var(--p-color-text-disabled, #b5b5b5);
  }

  /* --- variant: plain --- */
  :host([variant="plain"]) {
    --_bg: transparent;
    --_bg-hover: transparent;
    --_color: var(--p-color-primary, #303030);
    --_bg-disabled: transparent;
    --_color-disabled: var(--p-color-text-disabled, #b5b5b5);
  }
  :host([variant="plain"]) [part="base"] {
    min-height: auto;
    padding-inline: 0;
  }
  :host([variant="plain"]) .content {
    text-decoration: underline;
  }

  /* --- tone: critical --- */
  :host([tone="critical"][variant="primary"]) {
    --_bg: var(--p-color-critical, #c70a24);
    --_bg-hover: var(--p-color-critical-hover, #a30a24);
    --_bg-active: var(--p-color-critical-active, #8e0b21);
    --_bg-image: none;
    --_color-hover: var(--p-color-text-on-primary, #fff);
    --_color-active: var(--p-color-text-on-primary, #fff);
    --_shadow: inset 0 -1px 0 1px rgba(142, 11, 33, 0.8), inset 0 0 0 1px rgba(163, 10, 36, 0.8),
      inset 0 0.5px 0 1.5px rgba(247, 128, 134, 0.64);
    --_shadow-hover: inset 0 -1px 0 1px rgba(142, 11, 33, 0.8), inset 0 0 0 1px rgba(163, 10, 36, 0.8),
      inset 0 0.5px 0 1.5px rgba(247, 128, 134, 0.44);
    --_shadow-active: inset -1px 0 1px 0 rgba(0, 0, 0, 0.2), inset 1px 0 1px 0 rgba(0, 0, 0, 0.2),
      inset 0 2px 0 0 rgba(0, 0, 0, 0.6);
  }
  :host([tone="critical"]:not([variant="primary"])) {
    --_color: var(--p-color-critical-text, #8e0b21);
    --_color-hover: var(--p-color-critical-text, #8e0b21);
    --_color-active: var(--p-color-critical-text, #8e0b21);
  }

  @keyframes p-button-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
