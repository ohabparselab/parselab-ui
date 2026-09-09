// Plain CSS text, applied via a constructable stylesheet in
// PreactCustomElement (see internal/preact-custom-element.ts) — no Lit
// `css` tagged template needed since components no longer use Lit.
export default `
  :host {
    display: inline-block;
    font-family: var(--p-font-family, sans-serif);
    font-size: var(--p-font-size-base, 0.875rem);
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
    border: 1px solid transparent;
    border-radius: var(--_radius);
    padding: var(--_padding-block) var(--_padding-inline);
    font: inherit;
    font-weight: var(--p-font-weight-medium, 500);
    cursor: pointer;
    background: var(--_bg);
    color: var(--_color);
    border-color: var(--_border-color);
    transition: background var(--p-transition-fast, 120ms ease),
      border-color var(--p-transition-fast, 120ms ease);
  }

  [part="base"]:hover:not(:disabled) {
    background: var(--_bg-hover);
  }

  [part="base"]:focus-visible {
    outline: 2px solid var(--p-color-primary, #4f46e5);
    outline-offset: 2px;
  }

  [part="base"]:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* --- base sizing tokens --- */
  :host {
    --_radius: var(--p-radius-md, 6px);
    --_padding-block: var(--p-space-small, 0.5rem);
    --_padding-inline: var(--p-space-large, 1.25rem);
  }

  /* --- variant: primary --- */
  :host([variant="primary"]) {
    --_bg: var(--p-color-primary, #4f46e5);
    --_bg-hover: var(--p-color-primary-hover, #4338ca);
    --_color: var(--p-color-text-on-primary, #fff);
    --_border-color: transparent;
  }

  /* --- variant: secondary (default) --- */
  :host([variant="secondary"]),
  :host(:not([variant])) {
    --_bg: var(--p-color-neutral, #e5e7eb);
    --_bg-hover: var(--p-color-neutral-hover, #d1d5db);
    --_color: var(--p-color-text, #111827);
    --_border-color: transparent;
  }

  /* --- variant: tertiary --- */
  :host([variant="tertiary"]) {
    --_bg: transparent;
    --_bg-hover: var(--p-color-neutral, #e5e7eb);
    --_color: var(--p-color-text, #111827);
    --_border-color: var(--p-color-border, #d1d5db);
  }

  /* --- variant: plain --- */
  :host([variant="plain"]) {
    --_bg: transparent;
    --_bg-hover: transparent;
    --_color: var(--p-color-primary, #4f46e5);
    --_border-color: transparent;
  }
  :host([variant="plain"]) [part="base"] {
    padding-inline: 0;
    text-decoration: underline;
  }

  /* --- tone: critical overrides color regardless of variant --- */
  :host([tone="critical"][variant="primary"]) {
    --_bg: var(--p-color-critical, #dc2626);
    --_bg-hover: var(--p-color-critical-hover, #b91c1c);
  }
  :host([tone="critical"]:not([variant="primary"])) {
    --_color: var(--p-color-critical, #dc2626);
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
