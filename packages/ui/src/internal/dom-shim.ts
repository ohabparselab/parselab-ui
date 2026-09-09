/**
 * Must be the first import wherever a `p-*` component (or `lit` itself) is
 * imported. Frameworks like Next.js evaluate "use client" modules on the
 * server too (to produce the initial render), and `lit`'s `ReactiveElement`
 * extends the DOM's `HTMLElement` at module scope — importing it in Node,
 * where `HTMLElement` doesn't exist, throws immediately.
 *
 * `@lit-labs/ssr-dom-shim` defines a minimal stand-in for `HTMLElement`/
 * `customElements`/etc. only when they're missing, so this is a safe no-op
 * in real browsers. It does not implement full SSR (no server-rendered
 * markup) — components still only render after client-side hydration; see
 * PLAN.md's SSR section for the tracked follow-up (`@lit-labs/ssr`).
 */
import "@lit-labs/ssr-dom-shim";

export {};
