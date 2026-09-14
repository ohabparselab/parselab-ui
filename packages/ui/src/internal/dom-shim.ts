/**
 * Must be the first import wherever a `p-*` component (or `lit` itself) is
 * imported. Frameworks like Next.js and Remix evaluate "use client"/route
 * modules on the server too (to produce the initial render), and our
 * `PreactCustomElement` base class extends the DOM's `HTMLElement` at
 * module scope — importing it in Node, where `HTMLElement` doesn't exist,
 * throws immediately.
 *
 * `@lit-labs/ssr-dom-shim` only assigns `globalThis.Event`/`CustomEvent`
 * automatically; `HTMLElement` and `customElements` are exported for the
 * caller to assign itself, so we do that here explicitly, only when the
 * real DOM globals are missing (a safe no-op in real browsers). This does
 * not implement full SSR (no server-rendered markup) — components still
 * only render after client-side hydration; see PLAN.md's SSR section for
 * the tracked follow-up (`@lit-labs/ssr`).
 */
import { HTMLElement, customElements } from "@lit-labs/ssr-dom-shim";

if (typeof globalThis.HTMLElement === "undefined") {
  globalThis.HTMLElement = HTMLElement as unknown as typeof globalThis.HTMLElement;
}
if (typeof globalThis.customElements === "undefined") {
  globalThis.customElements = customElements as unknown as typeof globalThis.customElements;
}

export {};
