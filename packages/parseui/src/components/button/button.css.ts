/**
 * Shopify Polaris's default <s-button> design applied to native buttons.
 * Box-shadow/gradient/color values come from its compiled CSS — same values
 * as packages/ui's <p-button>, rewritten for attribute selectors.
 *
 *   view="primary | secondary | tertiary | plain"   (default: secondary)
 *   tone="critical | neutral"
 *   disabled, loading
 *
 * Each variant only sets private --_ custom properties; the base rule and
 * the shared state rules read them. Borders are drawn purely with
 * box-shadow (no real `border`), so a variant can remove or restyle its
 * border by changing only --_shadow.
 */
export const BUTTON_SELECTOR: string =
  'button, input:is([type="button"], [type="submit"], [type="reset"]), a[view]';

const b = `:is(${BUTTON_SELECTOR})`;
const inactive = ':is(:disabled, [disabled], [aria-disabled="true"], [loading])';

export const buttonCss: string = `
  ${b} {
    --_pad-block: 0.375rem;
    --_pad-inline: 0.75rem;
    --_press-shift: 1px;

    appearance: none;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    box-sizing: border-box;
    min-height: 1.75rem;
    margin: 0;
    padding: var(--_pad-block) var(--_pad-inline);
    border: none;
    border-radius: var(--p-radius-md);
    font: inherit;
    font-size: var(--p-font-size-small);
    font-weight: var(--p-font-weight-medium);
    line-height: 1rem;
    text-decoration: none;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    background-color: var(--_bg);
    background-image: var(--_bg-image, none);
    color: var(--_color);
    box-shadow: var(--_shadow, none);
    transition: background-color var(--p-transition-fast), color var(--p-transition-fast),
      box-shadow var(--p-transition-fast);
  }

  /* --- view: secondary (default) --- */
  ${b}:is(:not([view]), [view="secondary"], [view="auto"]) {
    --_bg: var(--p-color-neutral);
    --_bg-hover: var(--p-color-neutral-hover);
    --_bg-active: var(--p-color-neutral-active);
    --_color: var(--p-color-text);
    --_shadow: inset 0 -1px 0 0 var(--p-color-button-bevel-bottom), inset 0 0 0 1px var(--p-color-button-ring),
      inset 0 0.5px 0 1.5px var(--p-color-button-bevel-top);
    --_shadow-active: inset -1px 0 1px 0 rgba(26, 26, 26, 0.122), inset 1px 0 1px 0 rgba(26, 26, 26, 0.122),
      inset 0 2px 1px 0 rgba(26, 26, 26, 0.2);
    --_bg-disabled: var(--p-color-neutral-disabled);
    --_color-disabled: var(--p-color-text-disabled);
  }

  /* --- view: primary --- */
  ${b}[view="primary"] {
    --_bg: var(--p-color-primary);
    --_bg-hover: var(--p-color-primary-hover);
    --_bg-active: var(--p-color-primary-active);
    --_bg-image: linear-gradient(180deg, rgba(48, 48, 48, 0) 63.53%, rgba(255, 255, 255, 0.15) 100%);
    --_color: var(--p-color-text-on-primary);
    --_color-hover: var(--p-color-text-on-primary-hover);
    --_color-active: var(--p-color-text-on-primary-active);
    --_shadow: inset 0 -1px 0 1px rgba(0, 0, 0, 0.8), inset 0 0 0 1px var(--p-color-primary),
      inset 0 0.5px 0 1.5px rgba(255, 255, 255, 0.25);
    --_shadow-active: inset 0 3px 0 0 #000;
    --_bg-disabled: var(--p-color-primary-disabled);
    --_color-disabled: var(--p-color-text-on-primary);
  }

  /* --- view: tertiary --- */
  ${b}[view="tertiary"] {
    --_press-shift: 0px;
    --_bg: transparent;
    --_bg-hover: var(--p-color-surface-hover);
    --_bg-active: var(--p-color-surface-active);
    --_color: var(--p-color-text);
    --_bg-disabled: transparent;
    --_color-disabled: var(--p-color-text-disabled);
  }

  /* --- view: plain --- */
  ${b}[view="plain"] {
    --_press-shift: 0px;
    --_pad-inline: 0;
    --_bg: transparent;
    --_bg-hover: transparent;
    --_color: var(--p-color-primary);
    --_bg-disabled: transparent;
    --_color-disabled: var(--p-color-text-disabled);
    min-height: auto;
    text-decoration: underline;
  }

  /* --- tone: critical --- */
  ${b}[view="primary"][tone="critical"] {
    --_bg: var(--p-color-critical);
    --_bg-hover: var(--p-color-critical-hover);
    --_bg-active: var(--p-color-critical-active);
    --_bg-image: none;
    --_color: #fff;
    --_color-hover: #fff;
    --_color-active: #fff;
    --_shadow: inset 0 -1px 0 1px rgba(142, 11, 33, 0.8), inset 0 0 0 1px rgba(163, 10, 36, 0.8),
      inset 0 0.5px 0 1.5px rgba(247, 128, 134, 0.64);
    --_shadow-hover: inset 0 -1px 0 1px rgba(142, 11, 33, 0.8), inset 0 0 0 1px rgba(163, 10, 36, 0.8),
      inset 0 0.5px 0 1.5px rgba(247, 128, 134, 0.44);
    --_shadow-active: inset -1px 0 1px 0 rgba(0, 0, 0, 0.2), inset 1px 0 1px 0 rgba(0, 0, 0, 0.2),
      inset 0 2px 0 0 rgba(0, 0, 0, 0.6);
  }
  ${b}[tone="critical"]:not([view="primary"]) {
    --_color: var(--p-color-critical-text);
    --_color-hover: var(--p-color-critical-text);
    --_color-active: var(--p-color-critical-text);
  }

  /* --- states --- */
  ${b}:hover:not(${inactive}) {
    background-color: var(--_bg-hover);
    background-image: var(--_bg-image-hover, var(--_bg-image, none));
    box-shadow: var(--_shadow-hover, var(--_shadow, none));
    color: var(--_color-hover, var(--_color));
  }

  /* Pressed: the label moves down 1px while the box stays put (padding
     shift, since a native button has no inner element to translate). */
  ${b}:active:not(${inactive}) {
    padding-top: calc(var(--_pad-block) + var(--_press-shift));
    padding-bottom: calc(var(--_pad-block) - var(--_press-shift));
    background-color: var(--_bg-active, var(--_bg-hover));
    background-image: none;
    box-shadow: var(--_shadow-active, var(--_shadow, none));
    color: var(--_color-active, var(--_color-hover, var(--_color)));
  }

  ${b}:focus-visible {
    outline: 0.125rem solid var(--p-color-focus-ring);
    outline-offset: 0.0625rem;
  }
  ${b}:focus-visible:not(${inactive}) {
    background-color: var(--_bg-hover);
    background-image: var(--_bg-image-hover, var(--_bg-image, none));
    color: var(--_color-hover, var(--_color));
  }

  ${b}${inactive} {
    cursor: default;
    background-color: var(--_bg-disabled, var(--_bg));
    background-image: none;
    box-shadow: none;
    color: var(--_color-disabled, var(--_color));
  }
  a${inactive}[view] {
    pointer-events: none;
  }

  /* Loading: label hidden but still taking space (width stays stable),
     spinner centered on top — always neutral gray, like Polaris. */
  ${b}[loading] {
    color: transparent;
  }
  ${b}[loading]::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 0.875rem;
    height: 0.875rem;
    margin: auto;
    border: 2px solid var(--p-color-text-disabled);
    border-right-color: transparent;
    border-radius: 50%;
    animation: parseui-spin 0.6s linear infinite;
  }

  @keyframes parseui-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
