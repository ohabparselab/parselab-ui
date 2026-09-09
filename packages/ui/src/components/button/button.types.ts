import type { ReactNode } from "react";
import type { InteractionProps, SharedProps, Tone } from "../../internal/shared.js";

/**
 * Runtime props for <p-button> — every field always has a real value at
 * runtime (defaults are set on the class in button.ts), mirroring
 * Shopify's own split: its `ButtonProps` (the class-level contract) is
 * `Required<Pick<...>>`, and only the JSX-facing `ButtonJSXProps` below
 * is `Partial`. An earlier version of this file made `ButtonProps`
 * itself optional, blurring that distinction — fixed here.
 */
export interface ButtonProps extends SharedProps, InteractionProps {
  /** @default 'secondary' */
  variant: "primary" | "secondary" | "tertiary" | "plain";
  /** @default 'auto' */
  tone: Extract<Tone, "neutral" | "critical" | "auto">;
  /** Icon identifier. Typed and reflected today; not yet rendered — inert until `<p-icon>` ships. @default '' */
  icon: string;
  /** Shows a spinner and disables interaction. @default false */
  loading: boolean;
  /** Renders the button as a link when non-empty. @default '' */
  href: string;
  /** @default '' */
  target: "" | "_blank" | "_self" | "_parent" | "_top";
  /** @default '' */
  download: string;
  /** @default 'button' */
  type: "button" | "submit" | "reset";
}

export type ButtonCallbackEvent = CustomEvent<undefined>;

/**
 * JSX-facing props: everything from `ButtonProps` becomes optional (React
 * consumers only pass what differs from the default), plus `children` and
 * event callbacks. `.onclick`/`.onblur`/`.onfocus` are deliberately not
 * part of this contract — every custom element already inherits real,
 * working `onclick`/`onblur`/`onfocus` from `HTMLElement`'s native
 * `GlobalEventHandlers`, so there's nothing to add for those; only the
 * React-facing `onClick`/`onFocus`/`onBlur` callback shape needs typing.
 */
export interface ButtonJSXProps extends Partial<ButtonProps> {
  children?: ReactNode;
  onClick?: ((event: ButtonCallbackEvent) => void) | null;
  onFocus?: ((event: ButtonCallbackEvent) => void) | null;
  onBlur?: ((event: ButtonCallbackEvent) => void) | null;
}
