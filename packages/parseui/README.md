# parseui

Wrap any HTML in `<parse-ui>` and every tag inside renders in a **shadow root** with ParseUI's default design. Page CSS can't leak in, so it looks the same on any site.

## Install

**CDN** — one script tag in `<head>`:

```html
<script src="https://cdn.parseui.com/1.0.0/parseui.min.js"></script>
```

**npm**:

```bash
npm install parseui@latest
```

```js
import "parseui"; // loads https://cdn.parseui.com/<installed version>/parseui.min.js; no-op during SSR
```

The npm package contains no library code — it's a ~1 KB loader for the CDN file, so every site runs the same `parseui.min.js`. `registerIcons()`, `setIconBaseUrl()` and `registerComponent()` can be called right away (they're queued until the script arrives); `await load()` resolves with `window.ParseUI`.

## Usage

```html
<parse-ui>
  <h2>Checkout</h2>
  <p>Plain tags get ParseUI's design automatically.</p>
  <button view="primary">Pay now</button>
  <button view="secondary">Cancel</button>
</parse-ui>
```

`<parseui>` (no hyphen) also works in plain HTML — it's converted to `<parse-ui>` automatically. Custom element names must contain a hyphen, so inside React/Vue write `<parse-ui>`.

### Button

Works on `<button>`, `<input type="button|submit|reset">`, and `<a view="…">`.

A `<button>` with no attributes is shadcn/ui's default button — near-black (light in dark mode), 32px tall like inputs. `view="outline"` is shadcn's white outline button; other views are ParseUI's colors:

| Attribute | Values | Default |
|---|---|---|
| `view` | `outline` · `primary` · `secondary` · `gray` · `light` · `dark` · `soft` · `ghost` · `success` · `warning` · `info` · `danger` · `link` | — (shadcn default, near-black) |
| `outline` | boolean — outline version of the view | — |
| `size` | `xs` · `sm` · `md` · `lg` (24 / 28 / 32 / 36px) | `md` |
| `icon-only` | boolean — square button; add an `aria-label` | — |
| `full-width` | boolean — stretches to its container | — |
| `disabled` | boolean | — |
| `loading` | spinner, clicks blocked, `aria-busy="true"`. `loading` alone hides the label (width unchanged); `loading="start"` / `loading="end"` keep the label and put the spinner before / after it | — |

```html
<button>Default</button>
<button view="success">Approve</button>
<button view="danger">Delete</button>
<button view="ghost" size="sm">More</button>
<button view="primary" loading>Saving…</button>
<a view="primary" href="/orders">View orders</a>
```

### Theme

Light by default. `<parse-ui mode="dark">` forces dark; `mode="auto"` follows the OS setting.

Named themes override tokens per mode, then apply with `theme`:

```js
ParseUI.registerTheme({            // npm: import { registerTheme } from "parseui"
  name: "ocean",
  tokens: { radius: "4px" },                   // both modes
  light: { "color-primary": "#0f766e" },
  dark: { "color-primary": "#2dd4bf" },
});
```

```html
<parse-ui theme="ocean" mode="auto">…</parse-ui>
```

Only the listed tokens change; hover/soft/ring colors are derived from them. `Theme`, `ThemeToken` (every token name, for autocomplete), `ParseUIMode` and the attribute value types (`ParseUIView`, `ParseUISize`…) are exported from `parseui`.

### Customizing

Override design tokens on the element — page rules beat ParseUI's defaults:

```css
parse-ui {
  --p-color-primary: #16a34a;
  --p-radius: 4px;
}
```

Your own layout CSS goes in a `<style>` *inside* `<parse-ui>` (it moves into the shadow root with everything else):

```html
<parse-ui>
  <style>.actions { display: flex; gap: 8px; }</style>
  <div class="actions"><button view="primary">Save</button><button view="secondary">Cancel</button></div>
</parse-ui>
```

### Input

```html
<div field>
  <label for="email">Email</label>
  <input id="email" type="email" placeholder="name@example.com" required>
  <small>We'll never share your email.</small>
</div>
```

`<input>`, `<select>`, `<textarea>` and file inputs get the same design. `field` stacks a label, a control and a `<small>` description (`field="horizontal"` puts them in a row); `field-group` stacks fields (`field-group="horizontal"` side by side). `aria-invalid="true"`, `disabled` and `required` on the control also restyle its field's label. Inside a `group`, inputs join with buttons.

### Button group

```html
<div group role="group" aria-label="View">
  <button view="secondary" aria-pressed="true">List</button>
  <button view="secondary" aria-pressed="false">Board</button>
</div>
```

`group` joins the buttons inside (`group="vertical"` stacks them). `aria-pressed="true"` or `aria-current` marks the selected one.

### Icons

```html
<i icon="search"></i>
<button view="primary"><i icon="plus"></i> New product</button>
<i icon="star" size="24" stroke-width="1.2" style="color: #f59e0b"></i>
```

Each `<i icon>` loads its SVG from `https://cdn.parseui.com/icons/1.0.0/<name>.svg` once, then reuses it. To skip the network, register the set from [`@parseui/icons`](../icons):

```js
import { registerIcons } from "parseui";
import { icons } from "@parseui/icons";
registerIcons(icons);
```

…or serve the SVGs yourself with `setIconBaseUrl("/icons/")`.

### TypeScript / React

```ts
import type {} from "parseui/jsx"; // types <parse-ui> and view/size/icon-only/full-width/loading on <button>/<a>
```

In React, pass presence-only attributes an empty string — `loading=""`, `icon-only=""` (React warns on `={true}` for unknown attributes).

## Adding a component

Every component — including Button — is one `ComponentDefinition`: CSS plus an optional `setup` hook, registered once. See `src/components/button/` for the reference.

```js
ParseUI.registerComponent({            // CDN build: window.ParseUI
  name: "badge",
  css: `.badge { padding: 2px 8px; border-radius: 999px; background: var(--p-color-bg-muted); }`,
  setup(shadowRoot) {                   // optional, runs once per <parse-ui>
  },
});
```

```js
import { registerComponent } from "parseui"; // npm build
```

Components registered later (e.g. from a separate add-on script) apply to `<parse-ui>` elements already on the page.

## Caveats

Everything inside `<parse-ui>` lives in its shadow root, so:

- `document.querySelector()` / `getElementById()` can't see inside — use `document.querySelector("parse-ui").shadowRoot.querySelector(…)`.
- A `<form>` outside `<parse-ui>` won't submit inputs inside it — put the whole form inside. `<label for>` can't point across the boundary either.
- **React `onClick` on elements inside `<parse-ui>` doesn't fire** (React listens outside the shadow root). Native `onclick="…"` and `addEventListener` do work. React content inside *renders and updates* correctly — only its event handlers are affected. An event API is planned.
- Page CSS doesn't reach inside (by design) — use tokens or an inner `<style>`.

## Releasing

`npm run build` writes two things:

- `dist/cdn/parseui.min.js` (+ `.map`) — the library. Upload to `https://cdn.parseui.com/<version>/`.
- `dist/npm/parseui.js` + `dist/types/` — what `npm publish` ships.

**Upload to the CDN before publishing to npm.** The npm package loads the CDN file for its own version, so publishing first would point new installs at a file that isn't there yet. `npm run release` (see [RELEASING.md](../../RELEASING.md)) does both, in that order.
