import type { ComponentDefinition } from "../../core/registry";
import { BUTTON_SELECTOR, FILLED_VIEWS } from "../button/button.css";

/**
 * `<div group>` joins the buttons inside it into one control.
 *
 *   group               horizontal (default)
 *   group="vertical"    stacked
 *
 * Neighbours share a border (-1px overlap) and only the outer corners stay
 * rounded. Solid-fill views get a hairline divider instead of a border. A
 * button with `aria-pressed="true"` (or `aria-current`) shows as selected —
 * that's how a group becomes a segmented control; toggling it is up to you.
 * Buttons don't shrink when pressed inside a group, and give up their drop
 * shadow so the group reads as one surface.
 */
const g = "[group]";
const child = `${g} > :is(${BUTTON_SELECTOR})`;
const filled = `:is(${FILLED_VIEWS.map((view) => `[view="${view}"]`).join(", ")}):not([outline])`;
const selected = ':is([aria-pressed="true"], [aria-current]:not([aria-current="false"]))';
const none = "0 0 0 0 transparent";

const css = `
  ${g} {
    display: inline-flex;
    isolation: isolate;
    vertical-align: middle;
  }
  ${g}[group="vertical"] {
    flex-direction: column;
  }

  ${child} {
    --_press: 1;
    --_shadow: ${none};
    --_shadow-hover: ${none};
    --_shadow-active: ${none};
    margin: 0;
  }
  ${child}:hover,
  ${child}${selected} {
    z-index: 1;
  }
  ${child}:focus-visible {
    z-index: 2;
  }

  /* Horizontal: shared borders, outer corners only. */
  ${g}:not([group="vertical"]) > :is(${BUTTON_SELECTOR}):not(:first-child) {
    margin-inline-start: -1px;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }
  ${g}:not([group="vertical"]) > :is(${BUTTON_SELECTOR}):not(:last-child) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }
  ${g}:not([group="vertical"]) > :is(${BUTTON_SELECTOR})${filled}:not(:first-child) {
    --_shadow: inset 1px 0 0 color-mix(in oklab, currentColor 22%, transparent);
    --_shadow-hover: var(--_shadow);
    --_shadow-active: var(--_shadow);
  }

  /* Vertical: the same, top to bottom. */
  ${g}[group="vertical"] > :is(${BUTTON_SELECTOR}):not(:first-child) {
    margin-block-start: -1px;
    border-start-start-radius: 0;
    border-start-end-radius: 0;
  }
  ${g}[group="vertical"] > :is(${BUTTON_SELECTOR}):not(:last-child) {
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }
  ${g}[group="vertical"] > :is(${BUTTON_SELECTOR})${filled}:not(:first-child) {
    --_shadow: inset 0 1px 0 color-mix(in oklab, currentColor 22%, transparent);
    --_shadow-hover: var(--_shadow);
    --_shadow-active: var(--_shadow);
  }

  /* Selected (segmented control): shows the pressed colors, and keeps them on hover. */
  ${child}${selected} {
    --_bg: var(--_bg-active);
    --_bg-hover: var(--_bg-active);
    color: var(--_fg-hover, var(--_fg));
  }
`;

export const buttonGroup: ComponentDefinition = { name: "button-group", css };
