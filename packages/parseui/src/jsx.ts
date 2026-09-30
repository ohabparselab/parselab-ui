/**
 * Opt-in React/TSX types for ParseUI attributes. Add once to your project:
 *
 *   import type {} from "parseui/jsx";
 */
import "react";

import type {
  ParseUIButtonAttributes,
  ParseUIField,
  ParseUIFieldGroup,
  ParseUIGroup,
  ParseUIHostAttributes,
} from "./types";

export type * from "./types";

declare module "react" {
  // <i icon="search" /> — the icon's name (other elements ignore it).
  interface HTMLAttributes<T> {
    icon?: string;
    /** Joins the buttons inside into a button group. */
    group?: ParseUIGroup;
    /** Lays out a label, a control and a <small> description. */
    field?: ParseUIField;
    /** Stacks fields (or puts them side by side). */
    "field-group"?: ParseUIFieldGroup;
  }
  interface ButtonHTMLAttributes<T> extends ParseUIButtonAttributes {}
  interface AnchorHTMLAttributes<T> extends ParseUIButtonAttributes {}
  // <input> already has a numeric `size` (and `loading` makes no sense there).
  interface InputHTMLAttributes<T> extends Omit<ParseUIButtonAttributes, "size" | "loading"> {}

  namespace JSX {
    interface IntrinsicElements {
      "parse-ui": import("react").DetailedHTMLProps<
        import("react").HTMLAttributes<HTMLElement> & ParseUIHostAttributes,
        HTMLElement
      >;
    }
  }
}
