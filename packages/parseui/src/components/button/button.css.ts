/**
 * Button styles for native buttons inside `<parse-ui>`.
 *
 *   (no view)                                 neutral default (shadcn/ui colors)
 *   view="primary | secondary | gray | soft | ghost | success | danger | link"
 *   size="xs | sm | md | lg"
 *   icon-only, full-width, disabled, loading
 *
 * Filled buttons rest on a soft drop shadow. Hover deepens the fill and
 * lifts the shadow a little; pressing darkens the fill, flattens the shadow
 * and shrinks the button slightly, springing back on release.
 *
 * Each variant only sets private --_ custom properties; the base rule and
 * the shared state rules read them. The box-shadow is always
 * `<elevation>, <focus ring>`, so hover/press (elevation) and focus (ring)
 * never override each other.
 */
export const BUTTON_SELECTOR: string =
  'button, input:is([type="button"], [type="submit"], [type="reset"]), a[view]';

const b = `:is(${BUTTON_SELECTOR})`;
const inactive = ':is(:disabled, [disabled], [aria-disabled="true"], [loading])';

// No-op shadow, so shadow lists stay valid when a layer is "off".
const none = "0 0 0 0 transparent";

export const buttonCss: string = `
  /* --- default (no view) --- */
  ${b} {
    --_h: 2rem;
    --_px: 0.625rem;
    --_press: 0.97;

    --_bg: var(--p-button-default-bg);
    /* Hover eases toward the page color (the shadcn feel for a near-black or
       near-white fill); press comes back halfway, so it reads as "deeper". */
    --_bg-hover: color-mix(in oklab, var(--_bg) 88%, var(--p-color-bg));
    --_bg-active: color-mix(in oklab, var(--_bg) 94%, var(--p-color-bg));
    --_fg: var(--p-button-default-fg);
    --_border: transparent;

    --_inset: ${none};
    --_shadow: var(--p-shadow-xs), var(--_inset);
    --_shadow-hover: var(--p-shadow-sm), var(--_inset);
    --_shadow-active: ${none}, var(--_inset);
    --_shadow-now: var(--_shadow);
    --_focus: 0 0 0 3px color-mix(in oklab, var(--p-button-default-ring) 50%, transparent);
    --_ring-now: ${none};

    appearance: none;
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    box-sizing: border-box;
    height: var(--_h);
    margin: 0;
    padding: 0 var(--_px);
    border: 1px solid var(--_border);
    border-radius: var(--p-button-default-radius);
    background-color: var(--_bg);
    color: var(--_fg);
    box-shadow: var(--_shadow-now), var(--_ring-now);
    font: inherit;
    font-size: 0.875rem;
    font-weight: var(--p-font-weight-medium);
    line-height: 1.25rem;
    text-decoration: none;
    white-space: nowrap;
    vertical-align: middle;
    outline: none;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--p-transition-fast), border-color var(--p-transition-fast),
      color var(--p-transition-fast), box-shadow var(--p-transition-fast),
      transform 120ms cubic-bezier(0.2, 0, 0, 1);
  }

  ${b} svg:not([width]) {
    width: 1rem;
    height: 1rem;
  }
  ${b} svg {
    flex-shrink: 0;
    pointer-events: none;
  }

  /* --- views --- */
  ${b}[view] {
    --_h: 2.25rem;
    --_px: 0.875rem;
    --_focus: 0 0 0 2px var(--p-color-bg), 0 0 0 4px var(--p-color-primary);
    border-radius: var(--p-radius);
    line-height: 1;
    letter-spacing: -0.005em;
  }

  ${b}[view="primary"] {
    --_bg: var(--p-color-primary);
    --_bg-hover: var(--p-color-primary-hover);
    --_bg-active: color-mix(in oklab, var(--p-color-primary) 76%, var(--p-color-text));
    --_fg: var(--p-color-primary-foreground);
    --_inset: inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }
  ${b}[view="secondary"] {
    --_bg: var(--p-color-bg);
    --_bg-hover: var(--p-color-bg-subtle);
    --_bg-active: var(--p-color-bg-muted);
    --_fg: var(--p-color-text);
    --_border: var(--p-color-border-strong);
    --_border-hover: color-mix(in oklab, var(--p-color-border-strong) 80%, var(--p-color-text));
  }
  ${b}[view="gray"] {
    --_bg: var(--p-color-gray);
    --_bg-hover: var(--p-color-gray-hover);
    --_bg-active: color-mix(in oklab, var(--p-color-gray) 86%, var(--p-color-text));
    --_fg: var(--p-color-text);
  }
  ${b}[view="success"] {
    --_bg: var(--p-color-success);
    --_bg-hover: var(--p-color-success-hover);
    --_bg-active: color-mix(in oklab, var(--p-color-success) 78%, #000);
    --_fg: var(--p-color-success-foreground);
  }
  ${b}[view="danger"] {
    --_bg: var(--p-color-danger);
    --_bg-hover: var(--p-color-danger-hover);
    --_bg-active: color-mix(in oklab, var(--p-color-danger) 78%, #000);
    --_fg: #ffffff;
  }

  /* Flat views: no elevation, only a fill on hover/press. */
  ${b}:is([view="soft"], [view="ghost"], [view="link"]) {
    --_shadow: ${none};
    --_shadow-hover: ${none};
    --_shadow-active: ${none};
  }
  ${b}[view="soft"] {
    --_bg: var(--p-color-primary-soft);
    --_bg-hover: var(--p-color-primary-soft-hover);
    --_bg-active: color-mix(in oklab, var(--p-color-primary) 28%, var(--p-color-bg));
    --_fg: var(--p-color-primary-text);
  }
  ${b}[view="ghost"] {
    --_bg: transparent;
    --_bg-hover: var(--p-color-bg-muted);
    --_bg-active: color-mix(in oklab, var(--p-color-text) 10%, transparent);
    --_fg: var(--p-color-text-secondary);
    --_fg-hover: var(--p-color-text);
  }

  /* --- sizes (any view, including the default) --- */
  ${b}[size="xs"] {
    --_h: 1.75rem;
    --_px: 0.625rem;
    border-radius: var(--p-radius-sm);
    font-size: 0.8125rem;
  }
  ${b}[size="sm"] {
    --_h: 2rem;
    --_px: 0.75rem;
    font-size: 0.84375rem;
  }
  ${b}[size="md"] {
    --_h: 2.25rem;
    --_px: 0.875rem;
    font-size: 0.875rem;
  }
  ${b}[size="lg"] {
    --_h: 2.75rem;
    --_px: 1.125rem;
    font-size: 0.9375rem;
  }

  ${b}[icon-only] {
    width: var(--_h);
    padding-inline: 0;
  }
  ${b}[full-width] {
    width: 100%;
  }

  /* After sizes, so a link stays text-sized whatever size it's given. */
  ${b}[view="link"] {
    --_press: 1;
    --_bg: transparent;
    --_bg-hover: transparent;
    --_bg-active: transparent;
    --_fg: var(--p-color-primary-text);
    height: auto;
    padding: 0;
  }
  ${b}[view="link"]:hover:not(${inactive}) {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  /* --- states --- */
  ${b}:hover:not(${inactive}) {
    --_shadow-now: var(--_shadow-hover);
    background-color: var(--_bg-hover);
    border-color: var(--_border-hover, var(--_border));
    color: var(--_fg-hover, var(--_fg));
  }

  ${b}:focus-visible {
    --_ring-now: var(--_focus);
  }

  ${b}:active:not(${inactive}) {
    --_shadow-now: var(--_shadow-active);
    background-color: var(--_bg-active);
    transform: scale(var(--_press));
  }

  ${b}:is(:disabled, [disabled], [aria-disabled="true"]) {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Loading: label (and icons, via currentColor) hidden but still taking
     space so the width stays stable; spinner centered on top. */
  ${b}[loading] {
    color: transparent;
    cursor: default;
  }
  ${b}[loading]::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 1rem;
    height: 1rem;
    margin: auto;
    border: 2px solid var(--_fg);
    border-right-color: transparent;
    border-radius: 50%;
    animation: parseui-spin 0.6s linear infinite;
  }

  @keyframes parseui-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ${b} {
      --_press: 1;
      transition: none;
    }
  }
`;
