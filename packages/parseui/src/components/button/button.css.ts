/**
 * Button styles for native buttons inside `<parse-ui>`.
 *
 *   (no view)   shadcn/ui's default button — near-black (light in dark mode)
 *   view="outline"  shadcn/ui's outline button — white with a thin border
 *   view="primary | secondary | gray | light | dark | soft | ghost |
 *         success | warning | info | danger | link"   ParseUI's palette
 *   outline     any view as an outline button: transparent fill, colored
 *               border and label, a tint of the color on hover
 *   size="xs | sm | md | lg" (24 / 28 / 32 / 36px — shadcn's scale, so buttons
 *   line up with inputs), icon-only, full-width, disabled,
 *   loading (spinner replaces the label) | loading="start" | loading="end"
 *   (spinner beside the label)
 *
 * Filled buttons rest on a soft drop shadow. Hover deepens the fill and
 * lifts the shadow a little; pressing darkens the fill, flattens the shadow
 * and shrinks the button slightly, springing back on release.
 *
 * Each variant only sets private --_ custom properties; the base rule and
 * the shared state rules read them. The box-shadow is always
 * `<elevation>, <focus ring>`, so hover/press (elevation) and focus (ring)
 * never override each other. `--_accent` is a view's color, used by
 * `outline`. None of the variables below may reference `--_bg` or `--_fg`
 * (the button group swaps those for the pressed colors).
 */
export const BUTTON_SELECTOR: string =
  'button, input:is([type="button"], [type="submit"], [type="reset"]), a[view]';

const b = `:is(${BUTTON_SELECTOR})`;
const inactive = ':is(:disabled, [disabled], [aria-disabled="true"], [loading])';

// No-op shadow, so shadow lists stay valid when a layer is "off".
const none = "0 0 0 0 transparent";

/** Views with a solid fill (elevation, and a divider inside a group). The no-view default is solid too. */
export const FILLED_VIEWS: string[] = ["primary", "gray", "light", "dark", "success", "warning", "info", "danger"];

const elevated = `
    --_inset: ${none};
    --_shadow: var(--p-shadow-xs), var(--_inset);
    --_shadow-hover: var(--p-shadow-sm), var(--_inset);
    --_shadow-active: ${none}, var(--_inset);`;

const flat = `
    --_shadow: ${none};
    --_shadow-hover: ${none};
    --_shadow-active: ${none};`;

// A colored view: fill, hover, press and label — plus the accent `outline` uses.
const colored = (color: string, foreground: string, pressMix = "78%, #000") => `
    --_accent: var(--p-color-${color});
    --_bg: var(--p-color-${color});
    --_bg-hover: var(--p-color-${color}-hover);
    --_bg-active: color-mix(in oklab, var(--p-color-${color}) ${pressMix});
    --_fg: ${foreground};`;

export const buttonCss: string = `
  /* --- default (no view): shadcn/ui's default button, and the shared frame --- */
  ${b} {
    --_h: 2rem;
    --_px: 0.625rem;
    --_gap: 0.375rem;
    --_icon: 1rem;
    --_press: 0.97;

    --_bg: var(--p-button-default-bg);
    --_bg-hover: color-mix(in oklab, var(--p-button-default-bg) 80%, transparent);
    --_bg-active: color-mix(in oklab, var(--p-button-default-bg) 72%, transparent);
    --_fg: var(--p-button-default-fg);
    --_border: transparent;
    --_accent: var(--p-color-text);
    ${flat}
    --_shadow-now: var(--_shadow);
    --_focus: 0 0 0 3px color-mix(in oklab, var(--p-button-ring) 50%, transparent);
    --_ring-now: ${none};

    appearance: none;
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    gap: var(--_gap);
    box-sizing: border-box;
    height: var(--_h);
    margin: 0;
    padding: 0 var(--_px);
    border: 1px solid var(--_border);
    border-radius: var(--p-radius);
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
  /* Focus (every view): the border turns ring-gray, plus a 3px ring. */
  ${b}:focus-visible {
    border-color: var(--p-button-ring);
  }

  ${b} svg:not([width]) {
    width: var(--_icon);
    height: var(--_icon);
  }
  ${b} svg {
    flex-shrink: 0;
    pointer-events: none;
  }

  /* --- views (same frame and sizes; their own colors and elevation) --- */
  ${b}[view] {
    --_border: transparent;
    ${elevated}
  }

  /* shadcn/ui's outline button. */
  ${b}[view="outline"] {
    ${flat}
    --_bg: var(--p-button-outline-bg);
    --_bg-hover: var(--p-button-outline-hover);
    --_bg-active: var(--p-button-outline-active);
    --_fg: var(--p-button-outline-fg);
    --_border: var(--p-button-outline-border);
    --_accent: var(--p-color-text);
    --_outline-border: var(--p-button-outline-border);
  }

  ${b}[view="primary"] {
    ${colored("primary", "var(--p-color-primary-foreground)", "76%, var(--p-color-text)")}
    --_inset: inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }
  /* GitHub's green button: translucent border, its own resting shadow (no
     lift on hover) and an inset shadow when pressed. */
  ${b}[view="success"] {
    ${colored("success", "var(--p-color-success-foreground)")}
    --_bg-active: var(--p-color-success-active);
    --_border: var(--p-color-success-border);
    --_outline-border: var(--p-color-success);
    --_shadow: var(--p-button-success-shadow);
    --_shadow-hover: var(--p-button-success-shadow);
    --_shadow-active: var(--p-button-success-shadow-active);
  }
  /* Near-black; turns white in the dark theme. */
  ${b}[view="dark"] {
    ${colored("dark", "var(--p-color-dark-foreground)")}
    --_bg-active: var(--p-color-dark-active);
  }
  ${b}[view="warning"] {
    ${colored("warning", "var(--p-color-warning-foreground)")}
    --_accent-text: color-mix(in oklab, var(--p-color-warning) 70%, var(--p-color-text));
  }
  ${b}[view="info"] {
    ${colored("info", "var(--p-color-info-foreground)")}
  }
  ${b}[view="danger"] {
    ${colored("danger", "#ffffff")}
  }
  ${b}[view="light"] {
    ${colored("light", "var(--p-color-light-foreground)", "86%, #14141b")}
  }
  ${b}[view="gray"] {
    --_bg: var(--p-color-gray);
    --_bg-hover: var(--p-color-gray-hover);
    --_bg-active: color-mix(in oklab, var(--p-color-gray) 86%, var(--p-color-text));
    --_fg: var(--p-color-text);
    --_accent: var(--p-color-text-secondary);
    --_outline-border: var(--p-color-border-strong);
  }
  ${b}[view="secondary"] {
    --_bg: var(--p-color-bg);
    --_bg-hover: var(--p-color-bg-subtle);
    --_bg-active: var(--p-color-bg-muted);
    --_fg: var(--p-color-text);
    --_border: var(--p-color-border-strong);
    --_border-hover: color-mix(in oklab, var(--p-color-border-strong) 80%, var(--p-color-text));
    --_outline-border: var(--p-color-border-strong);
  }

  /* Flat views: no elevation, only a fill on hover/press. */
  ${b}:is([view="soft"], [view="ghost"], [view="link"]) {
    ${flat}
  }
  ${b}[view="soft"] {
    --_accent: var(--p-color-primary);
    --_bg: var(--p-color-primary-soft);
    --_bg-hover: var(--p-color-primary-soft-hover);
    --_bg-active: color-mix(in oklab, var(--p-color-primary) 28%, var(--p-color-bg));
    --_fg: var(--p-color-primary-text);
  }
  ${b}[view="ghost"] {
    --_accent: var(--p-color-text-secondary);
    --_bg: transparent;
    --_bg-hover: var(--p-color-bg-muted);
    --_bg-active: color-mix(in oklab, var(--p-color-text) 10%, transparent);
    --_fg: var(--p-color-text-secondary);
    --_fg-hover: var(--p-color-text);
    --_outline-border: var(--p-color-border-strong);
  }

  /* --- outline: any view --- */
  ${b}[view][outline] {
    ${flat}
    --_bg: transparent;
    --_bg-hover: color-mix(in oklab, var(--_accent) 10%, transparent);
    --_bg-active: color-mix(in oklab, var(--_accent) 18%, transparent);
    --_fg: var(--_accent-text, var(--_accent));
    --_fg-hover: var(--_accent-text, var(--_accent));
    --_border: var(--_outline-border, var(--_accent));
    --_border-hover: var(--_outline-border, var(--_accent));
  }

  /* --- sizes (any view, including the default): shadcn/ui's scale --- */
  ${b}[size="xs"] {
    --_h: 1.5rem;
    --_px: 0.5rem;
    --_gap: 0.25rem;
    --_icon: 0.75rem;
    border-radius: min(var(--p-radius-md), 10px);
    font-size: 0.75rem;
  }
  ${b}[size="sm"] {
    --_h: 1.75rem;
    --_px: 0.625rem;
    --_gap: 0.25rem;
    --_icon: 0.875rem;
    border-radius: min(var(--p-radius-md), 12px);
    font-size: 0.8rem;
  }
  ${b}[size="md"] {
    --_h: 2rem;
  }
  ${b}[size="lg"] {
    --_h: 2.25rem;
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
    --_accent: var(--p-color-primary);
    --_bg: transparent;
    --_bg-hover: transparent;
    --_bg-active: transparent;
    --_border: transparent;
    --_fg: var(--p-color-primary-text);
    height: auto;
    padding: 0;
    border-width: 0;
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

  /* Loading. Clicks are blocked for every form (see button.ts).
       loading          label (and icons, via currentColor) hidden but still
                        taking space, so the width stays stable; spinner
                        centered on top
       loading="start"  label stays; spinner before it (left in LTR)
       loading="end"    label stays; spinner after it (right in LTR)
     The side spinners are flex items, so they sit in the button's gap. */
  ${b}[loading] {
    cursor: default;
  }
  ${b}[loading]:not([loading="start"], [loading="end"]) {
    color: transparent;
  }
  ${b}[loading]:not([loading="start"], [loading="end"])::after,
  ${b}[loading="start"]::before,
  ${b}[loading="end"]::after {
    content: "";
    box-sizing: border-box;
    flex-shrink: 0;
    width: var(--_icon);
    height: var(--_icon);
    border: 2px solid var(--_fg);
    border-right-color: transparent;
    border-radius: 50%;
    animation: parseui-spin 0.6s linear infinite;
  }
  ${b}[loading]:not([loading="start"], [loading="end"])::after {
    position: absolute;
    inset: 0;
    margin: auto;
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
