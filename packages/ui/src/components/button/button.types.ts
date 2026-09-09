import type { ReactNode } from "react";

/**
 * Runtime props for <p-button>, mirroring the shape of Shopify's own
 * s-button (see @shopify/ui-extensions Button.d.ts): a props interface
 * plus a separate JSX-facing interface, kept in their own file apart
 * from the element implementation.
 */
export interface ButtonProps {
  /** @default 'secondary' */
  variant?: "primary" | "secondary" | "tertiary" | "plain";
  /** @default 'auto' */
  tone?: "neutral" | "critical" | "auto";
  /** Icon identifier, reserved for when <p-icon> ships. */
  icon?: string;
  /** @default false */
  disabled?: boolean;
  /** Shows a spinner and disables interaction. @default false */
  loading?: boolean;
  /** Renders the button as a link when set. */
  href?: string;
  target?: "" | "_blank" | "_self" | "_parent" | "_top";
  download?: string;
  /** @default 'button' */
  type?: "button" | "submit" | "reset";
  /** Accessible label for icon-only or ambiguous buttons. */
  accessibilityLabel?: string;
}

export type ButtonCallbackEvent = CustomEvent<undefined>;

export interface ButtonJSXProps extends Partial<ButtonProps> {
  children?: ReactNode;
  onClick?: ((event: ButtonCallbackEvent) => void) | null;
  onFocus?: ((event: ButtonCallbackEvent) => void) | null;
  onBlur?: ((event: ButtonCallbackEvent) => void) | null;
}
