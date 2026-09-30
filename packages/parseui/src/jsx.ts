/**
 * Opt-in React/TSX types for ParseUI attributes. Add once to your project:
 *
 *   import type {} from "parseui/jsx";
 */
import "react";

export type ParseUIView = "primary" | "secondary" | "tertiary" | "plain" | "auto";
export type ParseUITone = "critical" | "neutral" | "auto";
export type ParseUITheme = "light" | "dark" | "auto";

interface ParseUIButtonAttributes {
  view?: ParseUIView;
  tone?: ParseUITone;
  /** Presence-only: pass `loading=""` (React warns on `loading={true}` for an unknown boolean). */
  loading?: "";
}

declare module "react" {
  interface ButtonHTMLAttributes<T> extends ParseUIButtonAttributes {}
  interface AnchorHTMLAttributes<T> extends ParseUIButtonAttributes {}
  interface InputHTMLAttributes<T> extends Omit<ParseUIButtonAttributes, "loading"> {}

  namespace JSX {
    interface IntrinsicElements {
      "parse-ui": import("react").DetailedHTMLProps<
        import("react").HTMLAttributes<HTMLElement> & { theme?: ParseUITheme },
        HTMLElement
      >;
    }
  }
}
