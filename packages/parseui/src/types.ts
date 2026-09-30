/**
 * The attribute values ParseUI understands, as TypeScript types. React-free,
 * so any TypeScript project can use them (`import type { ParseUIView } from "parseui"`);
 * `parseui/jsx` builds its React typings on these.
 */
export type { ParseUIMode, Theme, ThemeTokens } from "./core/themes";
export type { ThemeToken } from "./tokens/tokens";

/** `<button view>` / `<a view>`. No view = the white outline default. */
export type ParseUIView =
  | "primary"
  | "secondary"
  | "gray"
  | "light"
  | "dark"
  | "soft"
  | "ghost"
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "link";

/** `<button size>`. `md` is the default for any `view`. */
export type ParseUISize = "xs" | "sm" | "md" | "lg";

/** `<button loading>`: `""` hides the label behind a spinner; `start` / `end` keep it, spinner before / after. */
export type ParseUILoading = "" | "start" | "end";

/** `<div group>`. */
export type ParseUIGroup = "" | "vertical";

/** `<div field>`. */
export type ParseUIField = "" | "horizontal";

/** `<div field-group>`. */
export type ParseUIFieldGroup = "" | "horizontal";

/** Attributes ParseUI adds to `<button>`, `<a>` and `<input type="button|submit|reset">`. */
export interface ParseUIButtonAttributes {
  view?: ParseUIView;
  size?: ParseUISize;
  /** Outline version of the view. Presence-only: `""`. */
  outline?: "";
  /** Square button for a single icon; add an aria-label. Presence-only: `""`. */
  "icon-only"?: "";
  /** Stretches to the container. Presence-only: `""`. */
  "full-width"?: "";
  loading?: ParseUILoading;
}

/** Attributes of the `<parse-ui>` element. */
export interface ParseUIHostAttributes {
  /** Light or dark. Default `light`; `auto` follows the OS. */
  mode?: import("./core/themes").ParseUIMode;
  /** A theme registered with registerTheme(). */
  theme?: string;
}
