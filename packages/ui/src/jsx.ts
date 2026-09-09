/**
 * Augments React's JSX namespace so raw custom-element tags (`<p-button>`)
 * type-check in .tsx files, mirroring how @shopify/ui-extensions augments
 * `preact`'s `createElement.JSX.IntrinsicElements` for `<s-button>` — same
 * pattern, targeting `react` instead of `preact`.
 *
 * Importing "@parselab/ui" (or "@parselab/ui/react") pulls this in
 * automatically; nothing further to import for raw-tag JSX support.
 */
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { PButton } from "./components/button/button.js";
import type { ButtonJSXProps } from "./components/button/button.types.js";

type CustomElementProps<Props, Element> = Props &
  Omit<DetailedHTMLProps<HTMLAttributes<Element>, Element>, keyof Props>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "p-button": CustomElementProps<ButtonJSXProps, PButton>;
    }
  }
}

export {};
