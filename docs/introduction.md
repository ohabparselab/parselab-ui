# Introduction

ParseUI is a drop-in UI kit. Add one script (or one npm package), wrap your markup in `<parse-ui>`, and every HTML tag inside gets ParseUI's design — on any site, in any framework.

## Why ParseUI

Most UI libraries need a build step, a framework, and a stylesheet that fights with the page's own CSS. ParseUI does none of that: it renders its content inside a shadow root, so the design looks the same whether it's dropped into a plain HTML page, a Shopify theme, or a React app.

## Principles

### Plain HTML first

You write normal tags — `<button>`, `<input>`, `<table>`. No custom component names to learn; variants are attributes like `view="primary"`.

### Isolated by default

Everything inside `<parse-ui>` lives in a shadow root. The page's CSS can't leak in, and ParseUI's CSS can't leak out.

### Tokens first

Color, radius, and type are CSS custom properties. Rebrand by overriding a few values on `parse-ui`.

### One file, two ways to install

Everything runs from one `parseui.min.js` on the CDN — the npm package is a tiny loader for that same file.

## What's inside

- **Base design** for every plain tag — headings, paragraphs, lists, links, code, tables, and form controls.
- **Button** — a white default plus eleven views (primary, secondary, gray, light, soft, ghost, success, warning, info, danger, link), outline versions of each, four sizes, icons, loading and disabled states.
- **Button group** — joined buttons, toolbars, and segmented controls with `group`.
- **Icons** — `<i icon="search">` by name from the CDN, or `@parseui/icons` React components from npm.
- **Light and dark themes** via the `theme` attribute.
- **A component registry** so new components (and add-on packages) plug in without touching the core.

## How it works

```html
<parse-ui>
  <h2>Checkout</h2>
  <button view="primary">Pay now</button>
</parse-ui>
```

When the script loads, `<parse-ui>` moves its children into its own shadow root and applies ParseUI's styles there. Tags outside `<parse-ui>` stay untouched.
