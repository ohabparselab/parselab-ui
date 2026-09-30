# npm setup

Install ParseUI from npm to use it in a project with a bundler — Vite, Next.js, Remix, or webpack.

## Install

```bash
npm install parseui@latest
```

Using another package manager:

```bash
pnpm add parseui@latest
yarn add parseui@latest
bun add parseui@latest
```

## Import once

Import the package once, in your app's entry file:

```js
import "parseui";
```

## How it loads

The npm package doesn't contain ParseUI's code. Importing it adds the CDN script for your major version's channel — `parseui@1.x` loads `https://cdn.parseui.com/v1/parseui.min.js` — so npm and plain-HTML sites run the very same file, and your bundle grows by under 1 KB. Fixes released to the CDN reach your app without reinstalling anything.

- It loads once, in the background. `<parse-ui>` elements already on the page render as soon as it arrives.
- `registerIcons()`, `setIconBaseUrl()`, and `registerComponent()` work right away — calls made before the script arrives are queued and applied before the first `<parse-ui>` renders.
- During server-side rendering the import does nothing.
- If your site sets a Content-Security-Policy, allow `https://cdn.parseui.com` in `script-src`.

To wait for it, or to load from somewhere else, call `load()` yourself — synchronously, at startup:

```js
import { load } from "parseui";

const ParseUI = await load(); // resolves with window.ParseUI
// load({ pin: true })  — the exact installed version instead of the channel
// load({ src: "https://…/parseui.min.js" }) — any other URL
```

## Use it

### HTML / vanilla JS

```js
import "parseui";

document.body.innerHTML = `
  <parse-ui>
    <button view="primary">Save changes</button>
  </parse-ui>
`;
```

### React

```tsx
import "parseui";
import type {} from "parseui/jsx";

export function SaveBar() {
  return (
    <parse-ui>
      <button view="primary">Save changes</button>
      <button view="secondary">Cancel</button>
    </parse-ui>
  );
}
```

`parseui/jsx` adds TypeScript types for `<parse-ui>` and the `view`, `size`, `icon-only`, `full-width`, and `loading` attributes. In React, pass presence-only attributes an empty string — `loading=""`, not `loading={true}`.

React renders and updates content inside `<parse-ui>` normally. **React `onClick` handlers on elements inside `<parse-ui>` don't fire yet** (React listens outside the shadow root) — attach listeners with `addEventListener` for now. An event API is planned.

## Add your own component

```js
import { registerComponent } from "parseui";

registerComponent({
  name: "badge",
  css: `.badge { padding: 2px 8px; border-radius: 999px; background: var(--p-color-bg-muted); }`,
});
```

Every `<parse-ui>` on the page picks it up — including ones already rendered.
