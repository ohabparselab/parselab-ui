# Theming

ParseUI is themed with CSS custom properties. Every `<parse-ui>` has a **mode** (light or dark) and, optionally, a named **theme** — a set of token values you register once.

## Light and dark mode

Light is the default. Set `mode` on `<parse-ui>`:

```html
<parse-ui mode="dark">…</parse-ui>   <!-- always dark -->
<parse-ui mode="auto">…</parse-ui>   <!-- follows the visitor's OS setting -->
<parse-ui mode="light">…</parse-ui>  <!-- always light (the default) -->
```

To follow your site's own dark-mode toggle, set the attribute from it:

```js
document.querySelectorAll("parse-ui").forEach((el) => el.setAttribute("mode", isDark ? "dark" : "light"));
```

## Tokens

Every color, radius and font is a `--p-*` custom property. Override one on the element — page rules beat ParseUI's defaults, so no `!important` is needed:

```css
parse-ui {
  --p-color-primary: #16a34a;
  --p-radius: 6px;
}
```

Hover, soft, and focus-ring colors are mixed from the base colors, so changing `--p-color-primary` recolors every primary state. The token list for each component is on its page, under **Design tokens**.

## Themes

A theme is a named set of tokens, with separate values for light and dark mode. Register it once, then select it with the `theme` attribute:

```js
ParseUI.registerTheme({
  name: "ocean",
  tokens: { radius: "4px" },                      // both modes
  light: { "color-primary": "#0f766e" },           // light mode
  dark: { "color-primary": "#2dd4bf", "color-bg": "#021a1a" }, // dark mode
});
```

```html
<parse-ui theme="ocean" mode="auto">
  <button view="primary">Ocean</button>
</parse-ui>
```

Only the tokens you list change; everything else keeps the default theme's value. Token names are written without the `--p-` prefix. Themes and modes combine freely, and themes registered later apply to elements already on the page.

With npm, import `registerTheme` instead — it works before the CDN script has finished loading:

```ts
import { registerTheme, type Theme } from "parseui";

const ocean: Theme = {
  name: "ocean",
  light: { "color-primary": "#0f766e" },
  dark: { "color-primary": "#2dd4bf" },
};
registerTheme(ocean);
```

## TypeScript

The `parseui` package ships types for everything:

| Type | |
|---|---|
| `Theme`, `ThemeTokens`, `ThemeToken` | themes — `ThemeToken` is the union of every token name, so editors autocomplete them and typos fail to compile |
| `ParseUIMode` | `"light" \| "dark" \| "auto"` |
| `ParseUIView`, `ParseUISize`, `ParseUILoading` | button attribute values |
| `ParseUIGroup`, `ParseUIField`, `ParseUIFieldGroup` | layout attribute values |
| `ParseUIButtonAttributes`, `ParseUIHostAttributes` | attribute sets, for your own component props |

For React, add `import type {} from "parseui/jsx"` once: `<parse-ui mode theme>`, `<button view size outline loading>`, `<div group field>`, and `<i icon>` are then type-checked in JSX.
