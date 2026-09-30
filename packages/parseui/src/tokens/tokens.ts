import type { ComponentDefinition } from "../core/registry";

/**
 * Design tokens, set on each `<parse-ui>` host. Pages override them on the
 * host, e.g. `parse-ui { --p-color-primary: #16a34a; }` — rules from the page
 * beat `:host` rules, so no `!important` is needed. Derived colors (hover,
 * soft, ring) are `color-mix()`es of the base ones, so overriding
 * `--p-color-primary` alone recolors every primary state.
 *
 * `--p-button-default-*` are the neutral colors of a button with no `view`
 * (shadcn/ui's default button); everything else is ParseUI's own palette.
 *
 * Light is the default regardless of OS preference (a dark-mode OS doesn't
 * mean the host page is dark); `theme="dark"` forces dark, `theme="auto"`
 * follows `prefers-color-scheme`.
 */
const dark = `
  color-scheme: dark;
  --p-color-bg: #0f0f14;
  --p-color-bg-subtle: #15151c;
  --p-color-bg-muted: #1c1c24;
  --p-color-border: #26262f;
  --p-color-border-strong: #34343f;
  --p-color-text: #ededf2;
  --p-color-text-secondary: #a6a6b3;
  --p-color-text-tertiary: #6e6e7c;
  --p-color-danger: #f26b6e;
  --p-color-success: #3dc98a;
  --p-color-success-foreground: #07140e;
  --p-color-gray: #2a2a33;
  --p-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.4);
  --p-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.45), 0 1px 2px rgba(0, 0, 0, 0.3);

  --p-button-default-bg: oklch(0.922 0 0);
  --p-button-default-fg: oklch(0.205 0 0);
  --p-button-default-ring: oklch(0.556 0 0);
`;

const css = `
  :host {
    display: block;
    color-scheme: light;

    --p-color-bg: #ffffff;
    --p-color-bg-subtle: #f8f8fa;
    --p-color-bg-muted: #f1f1f4;
    --p-color-border: #e7e7ec;
    --p-color-border-strong: #d6d6dd;
    --p-color-text: #14141b;
    --p-color-text-secondary: #51515e;
    --p-color-text-tertiary: #8b8b98;
    --p-color-primary: #2488ff;
    --p-color-primary-foreground: #ffffff;
    --p-color-danger: #dc3e42;
    --p-color-success: #12915a;
    --p-color-success-foreground: #ffffff;
    --p-color-gray: #e8e8ed;
    --p-shadow-xs: 0 1px 2px rgba(20, 20, 27, 0.05);
    --p-shadow-sm: 0 2px 4px rgba(20, 20, 27, 0.08), 0 1px 2px rgba(20, 20, 27, 0.05);

    --p-color-primary-hover: color-mix(in oklab, var(--p-color-primary) 86%, var(--p-color-text));
    --p-color-primary-soft: color-mix(in oklab, var(--p-color-primary) 11%, var(--p-color-bg));
    --p-color-primary-soft-hover: color-mix(in oklab, var(--p-color-primary) 20%, var(--p-color-bg));
    --p-color-primary-text: color-mix(in oklab, var(--p-color-primary) 82%, var(--p-color-text));
    --p-color-danger-hover: color-mix(in oklab, var(--p-color-danger) 88%, #000);
    --p-color-success-hover: color-mix(in oklab, var(--p-color-success) 88%, #000);
    --p-color-gray-hover: color-mix(in oklab, var(--p-color-gray) 94%, var(--p-color-text));
    --p-color-ring: color-mix(in oklab, var(--p-color-primary) 40%, transparent);

    --p-button-default-bg: oklch(0.205 0 0);
    --p-button-default-fg: oklch(0.985 0 0);
    --p-button-default-ring: oklch(0.708 0 0);
    --p-button-default-radius: 0.625rem;


    --p-radius: 0.5rem;
    --p-radius-sm: calc(var(--p-radius) * 0.75);
    --p-radius-lg: calc(var(--p-radius) * 1.5);

    --p-font-family: "Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --p-font-family-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    --p-font-size-body: 0.875rem;
    --p-font-size-small: 0.8125rem;
    --p-font-weight-regular: 400;
    --p-font-weight-medium: 500;
    --p-font-weight-semibold: 600;
    --p-font-weight-bold: 700;

    --p-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);

    font-family: var(--p-font-family);
    font-size: var(--p-font-size-body);
    font-weight: var(--p-font-weight-regular);
    line-height: 1.5;
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
