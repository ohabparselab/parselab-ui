/**
 * Shared prop palette, mirroring @shopify/ui-extensions' own `shared.d.ts`
 * (referenced internally by every component's `.d.ts` as `ButtonProps$1`,
 * `IconProps$1`, `InteractionProps`, etc.). Individual components `Pick`/
 * `Extract` from this broader palette and narrow value unions to their
 * own needs, so props like `accessibilityLabel`, `disabled`, and `lang`
 * stay named and typed consistently across every component in the
 * library.
 *
 * Introduced now, with only Button consuming it, so the pattern — and
 * the cross-component duplication it prevents — is established before
 * component #2 needs it, rather than retrofitted later.
 */

/** The full tone vocabulary used across components; individual components narrow this to the subset they support (e.g. Button only uses 'neutral' | 'critical' | 'auto'). */
export type Tone =
  | "auto"
  | "neutral"
  | "info"
  | "success"
  | "caution"
  | "warning"
  | "critical";

/**
 * Declarative control over another component's overlay state (e.g. a
 * future Modal/Popover), via the HTML Invoker Commands API
 * (https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement/command)
 * and the Open UI interest-invokers proposal. No custom event wiring
 * needed on our side — the browser dispatches these natively to the
 * target element referenced by `commandFor`/`interestFor`, once a
 * component that implements the receiving end (e.g. Modal) exists.
 */
export interface InteractionProps {
  /** @default '--auto' */
  command?: "--auto" | "--show" | "--hide" | "--toggle";
  /** The `id` of the component this element controls. */
  commandFor?: string;
  /** The `id` of the component to signal "interest" in. */
  interestFor?: string;
}

/** Props shared by nearly every interactive/labelable component in the library. */
export interface SharedProps {
  /** Accessible label for assistive technology; most important when there's no visible text content. @default '' */
  accessibilityLabel?: string;
  /** Disables interaction. @default false */
  disabled?: boolean;
  /** BCP 47 language tag (e.g. 'en', 'fr'), for correct assistive-technology pronunciation. @default '' */
  lang?: string;
}
