/**
 * Opt-in React/TSX types for ParseUI attributes. Add once to your project:
 *
 *   import type {} from "parseui/jsx";
 */
import "react";

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
export type ParseUISize = "xs" | "sm" | "md" | "lg";
export type ParseUITheme = "light" | "dark" | "auto";

// Presence-only attributes take `""` — React warns on `attr={true}` for an
// unknown boolean attribute.
interface ParseUIButtonAttributes {
  view?: ParseUIView;
  size?: ParseUISize;
  outline?: "";
  "icon-only"?: "";
  "full-width"?: "";
  /** `""`: spinner replaces the label. `"start"` / `"end"`: spinner before / after the label, which stays visible. */
  loading?: "" | "start" | "end";
}

declare module "react" {
  // <i icon="search" /> — the icon's name (other elements ignore it).
  interface HTMLAttributes<T> {
    icon?: string;
    /** Joins the buttons inside into a button group. */
    group?: "" | "vertical";
  }
  interface ButtonHTMLAttributes<T> extends ParseUIButtonAttributes {}
  interface AnchorHTMLAttributes<T> extends ParseUIButtonAttributes {}
  // <input> already has a numeric `size` (and `loading` makes no sense there).
  interface InputHTMLAttributes<T> extends Omit<ParseUIButtonAttributes, "size" | "loading"> {}

  namespace JSX {
    interface IntrinsicElements {
      "parse-ui": import("react").DetailedHTMLProps<
        import("react").HTMLAttributes<HTMLElement> & { theme?: ParseUITheme },
        HTMLElement
      >;
    }
  }
}
