import type { ComponentDefinition } from "../core/registry";

/**
 * Design tokens, set on each `<parse-ui>` host. Light values are Shopify
 * Polaris's own (same as packages/ui/src/tokens/tokens.css). Pages override
 * them on the host, e.g. `parse-ui { --p-color-primary: #16a34a; }` — rules
 * from the page beat `:host` rules, so no `!important` is needed.
 *
 * Light is the default regardless of OS preference (a dark-mode OS doesn't
 * mean the host page is dark); `theme="dark"` forces dark, `theme="auto"`
 * follows `prefers-color-scheme`.
 */
const dark = `
  color-scheme: dark;
  --p-color-primary: #e3e3e3;
  --p-color-primary-hover: #d4d4d4;
  --p-color-primary-active: #c7c7c7;
  --p-color-primary-disabled: rgba(255, 255, 255, 0.17);
  --p-color-critical-text: #ff6b6b;
  --p-color-neutral: #2c2c2c;
  --p-color-neutral-hover: #3a3a3a;
  --p-color-neutral-active: #242424;
  --p-color-neutral-disabled: rgba(255, 255, 255, 0.05);
  --p-color-surface: #1f1f1f;
  --p-color-surface-secondary: #2a2a2a;
  --p-color-surface-hover: rgba(255, 255, 255, 0.08);
  --p-color-surface-active: rgba(255, 255, 255, 0.14);
  --p-color-text-on-primary: #1a1a1a;
  --p-color-text-on-primary-hover: #2b2b2b;
  --p-color-text-on-primary-active: #3f3f3f;
  --p-color-text: #f4f4f5;
  --p-color-text-secondary: #a1a1aa;
  --p-color-text-disabled: #6b6b6b;
  --p-color-link: #6ea8ff;
  --p-color-link-hover: #9cc2ff;
  --p-color-border: #454545;
  --p-color-input-border: #6b6b6b;
  --p-color-input-border-hover: #8a8a8a;
  --p-color-button-bevel-top: rgba(255, 255, 255, 0.06);
  --p-color-button-bevel-bottom: #1a1a1a;
  --p-color-button-ring: rgba(255, 255, 255, 0.14);
`;

const css = `
  :host {
    display: block;
    color-scheme: light;

    --p-color-primary: #303030;
    --p-color-primary-hover: #1a1a1a;
    --p-color-primary-active: #1a1a1a;
    --p-color-primary-disabled: rgba(0, 0, 0, 0.17);
    --p-color-critical: #c70a24;
    --p-color-critical-hover: #a30a24;
    --p-color-critical-active: #8e0b21;
    --p-color-critical-text: #8e0b21;
    --p-color-neutral: #ffffff;
    --p-color-neutral-hover: #fafafa;
    --p-color-neutral-active: #f7f7f7;
    --p-color-neutral-disabled: rgba(0, 0, 0, 0.05);
    --p-color-surface: #ffffff;
    --p-color-surface-secondary: #f7f7f7;
    --p-color-surface-hover: rgba(0, 0, 0, 0.05);
    --p-color-surface-active: rgba(0, 0, 0, 0.08);
    --p-color-text-on-primary: #ffffff;
    --p-color-text-on-primary-hover: #e3e3e3;
    --p-color-text-on-primary-active: #cccccc;
    --p-color-text: #303030;
    --p-color-text-secondary: #616161;
    --p-color-text-disabled: #b5b5b5;
    --p-color-link: #005bd3;
    --p-color-link-hover: #004299;
    --p-color-border: #e3e3e3;
    --p-color-input-border: #8a8a8a;
    --p-color-input-border-hover: #616161;
    --p-color-focus-ring: #005bd3;
    --p-color-button-bevel-top: #ffffff;
    --p-color-button-bevel-bottom: #b5b5b5;
    --p-color-button-ring: rgba(0, 0, 0, 0.1);

    --p-radius-sm: 0.25rem;
    --p-radius-md: 0.5rem;
    --p-radius-lg: 0.75rem;

    --p-font-family: "Inter", -apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
    --p-font-family-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    --p-font-size-body: 0.8125rem;
    --p-font-size-small: 0.75rem;
    --p-font-weight-regular: 450;
    --p-font-weight-medium: 550;
    --p-font-weight-semibold: 650;
    --p-font-weight-bold: 700;

    --p-transition-fast: 120ms ease;

    font-family: var(--p-font-family);
    font-size: var(--p-font-size-body);
    font-weight: var(--p-font-weight-regular);
    line-height: 1.25rem;
    color: var(--p-color-text);
    -webkit-font-smoothing: antialiased;
  }

  :host([hidden]) {
    display: none;
  }

  :host([theme="dark"]) {${dark}}

  @media (prefers-color-scheme: dark) {
    :host([theme="auto"]) {${dark}}
  }

  .parse-ui-content {
    display: contents;
  }
`;

export const tokens: ComponentDefinition = { name: "tokens", css };
