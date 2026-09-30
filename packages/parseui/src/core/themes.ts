import { registerComponent } from "./registry";
import { declarations, type ThemeToken } from "../tokens/tokens";

/** Token values keyed by token name (without the `--p-` prefix). */
export type ThemeTokens = Partial<Record<ThemeToken, string>>;

/** How a `<parse-ui>` picks light or dark: its `mode` attribute. Default `light`. */
export type ParseUIMode = "light" | "dark" | "auto";

/**
 * A named theme, selected with `<parse-ui theme="<name>">`. Only the tokens
 * you set change; everything else keeps the default theme's value, and
 * derived colors (hover, soft, ring…) follow the new base colors.
 */
export interface Theme {
  /** kebab-case, e.g. "ocean". */
  name: string;
  /** Applied in both modes — radius, fonts, or colors that don't change with the mode. */
  tokens?: ThemeTokens;
  /** Light mode (the default). */
  light?: ThemeTokens;
  /** `mode="dark"`, and `mode="auto"` when the OS is dark. */
  dark?: ThemeTokens;
}

// Values end up inside a stylesheet: refuse anything that could close the rule.
const unsafe = /[;{}<>]/;

function clean(theme: Theme, tokens: ThemeTokens | undefined): ThemeTokens {
  const safe: ThemeTokens = {};
  for (const [name, value] of Object.entries(tokens ?? {}) as [ThemeToken, string][]) {
    if (!/^[a-z0-9-]+$/.test(name) || typeof value !== "string" || unsafe.test(value)) {
      console.warn(`[parseui] theme "${theme.name}": ignoring token "${name}"`);
      continue;
    }
    safe[name] = value;
  }
  return safe;
}

/** The stylesheet for one theme. Exported for tests and tooling. */
export function themeCss(theme: Theme): string {
  const t = `[theme="${theme.name}"]`;
  const light = declarations(clean(theme, theme.light));
  const dark = declarations(clean(theme, theme.dark));
  return `
  :host(${t}) { ${declarations(clean(theme, theme.tokens))} }

  :host(${t}:not([mode="dark"], [mode="auto"])) { ${light} }
  @media (prefers-color-scheme: light) {
    :host(${t}[mode="auto"]) { ${light} }
  }

  :host(${t}[mode="dark"]) { ${dark} }
  @media (prefers-color-scheme: dark) {
    :host(${t}[mode="auto"]) { ${dark} }
  }
`;
}

/**
 * Adds a theme to every `<parse-ui>` (including ones already on the page).
 * Register each name once.
 */
export function registerTheme(theme: Theme): void {
  if (!/^[a-z][a-z0-9-]*$/.test(theme?.name ?? "")) {
    console.warn(`[parseui] registerTheme: "${theme?.name}" isn't a valid theme name (use kebab-case, e.g. "ocean").`);
    return;
  }
  registerComponent({ name: `theme:${theme.name}`, css: themeCss(theme) });
}
