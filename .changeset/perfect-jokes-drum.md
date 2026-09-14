---
"@parselabllc/ui": patch
---

Fix `HTMLElement`/`customElements` not actually being polyfilled in Node — `@lit-labs/ssr-dom-shim` only auto-patches `globalThis.Event`/`CustomEvent`, not `HTMLElement`/`customElements` as the previous comment assumed, so any SSR framework that evaluates `@parselabllc/ui`/`@parselabllc/ui/react` on the server (e.g. Remix) crashed with `HTMLElement is not defined`. Also fixes the package's own build silently tree-shaking that shim away, because `sideEffects` in `package.json` didn't cover `src/**/*.ts` (used while building the package itself) or `dist/esm/react.js` (the `/react` entry point, for downstream consumers).
