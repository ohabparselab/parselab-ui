import type { ComponentDefinition } from "../core/registry";

/**
 * ParseUI's design tokens — the built-in (default) theme. Every token is a
 * `--p-<name>` custom property on each `<parse-ui>` host.
 *
 * Three layers:
 *   lightTokens    the base values (light mode, plus mode-independent ones
 *                  like radius and fonts)
 *   darkTokens     overrides for dark mode
 *   derivedTokens  colors computed from the base ones (hover, soft, ring…),
 *                  declared once, so they follow any theme and mode
 *
 * Themes (core/themes.ts) override the base layer by name, and pages can still
 * set a token directly: `parse-ui { --p-color-primary: #16a34a; }`.
 *
 * Mode: light by default regardless of OS preference (a dark-mode OS doesn't
 * mean the host page is dark); `mode="dark"` forces dark, `mode="auto"`
 * follows `prefers-color-scheme`.
 *
 * `button-default-*` / `input-*` are shadcn/ui's neutral outline-button and
 * input colors; the rest is ParseUI's palette. See design/DESIGN.md.
 */
export const lightTokens = {
  "color-bg": "#ffffff",
  "color-bg-subtle": "#f8f8fa",
  "color-bg-muted": "#f1f1f4",
  "color-border": "#e7e7ec",
  "color-border-strong": "#d6d6dd",
  "color-text": "#14141b",
  "color-text-secondary": "#51515e",
  "color-text-tertiary": "#8b8b98",
  "color-primary": "#2488ff",
  "color-primary-foreground": "#ffffff",
  "color-danger": "#dc3e42",
  "color-success": "#1f883d",
  "color-success-hover": "#1c8139",
  "color-success-active": "#197935",
  "color-success-foreground": "#ffffff",
  "color-success-border": "rgba(31, 35, 40, 0.15)",
  "button-success-shadow": "0 1px 1px 0 rgba(31, 35, 40, 0.04), 0 1px 2px 0 rgba(31, 35, 40, 0.03)",
  "button-success-shadow-active": "inset 0 1px 0 0 rgba(0, 45, 17, 0.3)",
  "color-dark": "#14141b",
  "color-dark-foreground": "#ffffff",
  "color-dark-hover": "color-mix(in oklab, var(--p-color-dark) 88%, #fff)",
  "color-dark-active": "color-mix(in oklab, var(--p-color-dark) 80%, #fff)",
  "color-gray": "#e8e8ed",
  "color-warning": "#f5a524",
  "color-warning-foreground": "#1f1300",
  "color-info": "#0891b2",
  "color-info-foreground": "#ffffff",
  "color-light": "#f4f4f6",
  "color-light-foreground": "#14141b",
  "shadow-xs": "0 1px 2px rgba(20, 20, 27, 0.05)",
  "shadow-sm": "0 2px 4px rgba(20, 20, 27, 0.08), 0 1px 2px rgba(20, 20, 27, 0.05)",
  "button-default-bg": "#ffffff",
  "button-default-hover": "oklch(0.97 0 0)",
  "button-default-active": "oklch(0.94 0 0)",
  "button-default-fg": "oklch(0.145 0 0)",
  "button-default-border": "oklch(0.922 0 0)",
  "button-default-ring": "oklch(0.708 0 0)",
  "button-default-radius": "0.625rem",
  "input-bg": "transparent",
  "input-border": "oklch(0.922 0 0)",
  "input-disabled-bg": "color-mix(in oklab, oklch(0.922 0 0) 50%, transparent)",
  "input-muted": "oklch(0.556 0 0)",
  "input-ring": "oklch(0.708 0 0)",
  "input-invalid-border": "var(--p-color-danger)",
  "input-invalid-ring": "color-mix(in oklab, var(--p-color-danger) 20%, transparent)",
  "input-radius": "0.625rem",
  "radius": "0.5rem",
  "font-family": "\"Geist\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif",
  "font-family-mono": "\"Geist Mono\", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  "font-size-body": "0.875rem",
  "font-size-small": "0.8125rem",
  "font-weight-regular": "400",
  "font-weight-medium": "500",
  "font-weight-semibold": "600",
  "font-weight-bold": "700",
  "transition-fast": "150ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const darkTokens = {
  "color-bg": "#0f0f14",
  "color-bg-subtle": "#15151c",
  "color-bg-muted": "#1c1c24",
  "color-border": "#26262f",
  "color-border-strong": "#34343f",
  "color-text": "#ededf2",
  "color-text-secondary": "#a6a6b3",
  "color-text-tertiary": "#6e6e7c",
  "color-danger": "#f26b6e",
  "color-success": "#238636",
  "color-success-hover": "#29903b",
  "color-success-active": "#2e9a40",
  "color-success-border": "rgba(255, 255, 255, 0.15)",
  "button-success-shadow": "0 1px 1px 0 rgba(1, 4, 9, 0.6), 0 1px 3px 0 rgba(1, 4, 9, 0.6)",
  "button-success-shadow-active": "0 0 0 0 transparent",
  "color-dark": "#ededf2",
  "color-dark-foreground": "#14141b",
  "color-dark-hover": "color-mix(in oklab, var(--p-color-dark) 90%, #000)",
  "color-dark-active": "color-mix(in oklab, var(--p-color-dark) 82%, #000)",
  "color-gray": "#2a2a33",
  "color-warning": "#f0b34a",
  "color-info": "#22d3ee",
  "color-info-foreground": "#04161b",
  "shadow-xs": "0 1px 2px rgba(0, 0, 0, 0.4)",
  "shadow-sm": "0 2px 4px rgba(0, 0, 0, 0.45), 0 1px 2px rgba(0, 0, 0, 0.3)",
  "button-default-bg": "rgba(255, 255, 255, 0.045)",
  "button-default-hover": "rgba(255, 255, 255, 0.075)",
  "button-default-active": "rgba(255, 255, 255, 0.11)",
  "button-default-fg": "oklch(0.985 0 0)",
  "button-default-border": "rgba(255, 255, 255, 0.15)",
  "button-default-ring": "oklch(0.556 0 0)",
  "input-bg": "rgba(255, 255, 255, 0.045)",
  "input-border": "rgba(255, 255, 255, 0.15)",
  "input-disabled-bg": "rgba(255, 255, 255, 0.12)",
  "input-muted": "oklch(0.708 0 0)",
  "input-ring": "oklch(0.556 0 0)",
  "input-invalid-border": "color-mix(in oklab, var(--p-color-danger) 50%, transparent)",
  "input-invalid-ring": "color-mix(in oklab, var(--p-color-danger) 40%, transparent)",
} as const;

export const derivedTokens = {
  "color-primary-hover": "color-mix(in oklab, var(--p-color-primary) 86%, var(--p-color-text))",
  "color-primary-soft": "color-mix(in oklab, var(--p-color-primary) 11%, var(--p-color-bg))",
  "color-primary-soft-hover": "color-mix(in oklab, var(--p-color-primary) 20%, var(--p-color-bg))",
  "color-primary-text": "color-mix(in oklab, var(--p-color-primary) 82%, var(--p-color-text))",
  "color-danger-hover": "color-mix(in oklab, var(--p-color-danger) 88%, #000)",
  "color-gray-hover": "color-mix(in oklab, var(--p-color-gray) 94%, var(--p-color-text))",
  "color-warning-hover": "color-mix(in oklab, var(--p-color-warning) 90%, #000)",
  "color-info-hover": "color-mix(in oklab, var(--p-color-info) 88%, #000)",
  "color-light-hover": "color-mix(in oklab, var(--p-color-light) 94%, #14141b)",
  "color-ring": "color-mix(in oklab, var(--p-color-primary) 40%, transparent)",
  "radius-sm": "calc(var(--p-radius) * 0.75)",
  "radius-lg": "calc(var(--p-radius) * 1.5)",
} as const;

/** Every token a theme can set (names without the `--p-` prefix). */
export type ThemeToken = keyof typeof lightTokens | keyof typeof darkTokens | keyof typeof derivedTokens;

/** `name: value` pairs as custom-property declarations. */
export function declarations(tokens: Partial<Record<string, string>>): string {
  return Object.entries(tokens)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .map(([name, value]) => `--p-${name}: ${value};`)
    .join("\n    ");
}

const css = `
  :host {
    display: block;
    color-scheme: light;
    ${declarations(lightTokens)}
    ${declarations(derivedTokens)}

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

  :host([mode="dark"]) {
    color-scheme: dark;
    ${declarations(darkTokens)}
  }

  @media (prefers-color-scheme: dark) {
    :host([mode="auto"]) {
      color-scheme: dark;
      ${declarations(darkTokens)}
    }
  }

  .parse-ui-content {
    display: contents;
  }
`;

export const tokens: ComponentDefinition = { name: "tokens", css };
