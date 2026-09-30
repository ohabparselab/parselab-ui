# npm setup

Install ParseUI from npm to use it in a project with a bundler — Vite, Next.js, Remix, or webpack.

## Install

```bash
npm install parseui
```

## Import once

Import the package once, in your app's entry file. It registers `<parse-ui>` as a side effect:

```js
import "parseui";
```

The import is safe during server-side rendering — it does nothing until it runs in a browser.

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
      <button>Cancel</button>
    </parse-ui>
  );
}
```

`parseui/jsx` adds TypeScript types for `<parse-ui>` and the `view`, `tone`, and `loading` attributes. In React, pass `loading=""` rather than `loading={true}`.

React renders and updates content inside `<parse-ui>` normally. **React `onClick` handlers on elements inside `<parse-ui>` don't fire yet** (React listens outside the shadow root) — attach listeners with `addEventListener` for now. An event API is planned.

## Use the bundled file directly

The package also ships the CDN build, if you'd rather self-host it:

```js
import "parseui/parseui.min.js";
```

## Add your own component

```js
import { registerComponent } from "parseui";

registerComponent({
  name: "badge",
  css: `.badge { padding: 2px 8px; border-radius: 999px; background: var(--p-color-surface-secondary); }`,
});
```

Every `<parse-ui>` on the page picks it up — including ones already rendered.
