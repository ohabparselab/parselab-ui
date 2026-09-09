# @parselab/ui

Parselab's own UI component library — real **Web Components** (`<p-button>`, ...), built with [Lit](https://lit.dev), usable from any React-based framework (Next.js, Remix) or plain HTML, with no framework lock-in.

Architecturally modeled on Shopify's [`@shopify/ui-extensions`](https://shopify.dev/docs/api/app-home) (custom elements registered globally, consumed directly as JSX tags), but with a `p-` prefix instead of Shopify's `s-`, built on Lit instead of Preact, and published as a public, standalone package.

> **Status**: early. Only `<p-button>` exists today, published to prove the full architecture (component → types → docs → build → npm publish → real-world install) before extending toward parity with Shopify's ~62-component admin surface. See [`PLAN.md`](./PLAN.md) for the full roadmap and architectural rationale.

## Install

```bash
npm install @parselab/ui
```

## Usage

### React / Next.js / Remix (recommended)

```tsx
import { Button } from "@parselab/ui/react";

<Button variant="primary" onClick={() => save()}>
  Save
</Button>;
```

### Raw custom element (any framework, or plain HTML)

```tsx
import "@parselab/ui";

<p-button variant="primary" onClick={() => save()}>
  Save
</p-button>;
```

> **Next.js (App Router)**: import `@parselab/ui`/`@parselab/ui/react` via `next/dynamic` with `ssr: false` — Next evaluates "use client" modules on the server too, and Lit's custom elements need a real browser `HTMLElement` at import time. See [`docs/admin/button.md`](./docs/admin/button.md#nextjs-app-router--import-it-client-only) for the tested pattern. Full SSR is on the roadmap.

### Theming

```css
:root {
  --p-color-primary: #16a34a;
}
```

Or import the default token sheet and override from there:

```ts
import "@parselab/ui/tokens.css";
```

## Documentation

Per-component docs live in [`docs/admin/`](./docs/admin) (e.g. [`docs/admin/button.md`](./docs/admin/button.md)) — props, events, CSS custom properties, slots/parts, and accessibility notes for each component. This path anticipates a future docs site at `parselab.dev/docs/admin/...`; until that site exists, read the markdown directly.

## Repo layout

```
parselab-ui/
  PLAN.md              # architecture, decisions, and roadmap — read this first
  docs/admin/           # per-component documentation
  packages/ui/          # the @parselab/ui package itself
    src/
      components/       # one folder per component: <name>.ts, .styles.ts, .types.ts
      tokens/            # public design-token CSS sheet
      index.ts           # registers every element (side effect)
      react.ts            # @lit/react wrappers, React-idiomatic props/events
      jsx.ts               # React JSX IntrinsicElements typings
```

## Development

```bash
npm install
npm run build            # builds @parselab/ui: JS (esm+cjs), types, custom-elements.json
npm run typecheck
```

## Contributing a new component

Every component follows the exact shape `button/` establishes — see [`PLAN.md`](./PLAN.md#component-pattern--mirrors-shopifys-own-architecture) for the full pattern and the [documentation template](./PLAN.md#documentation-template). In short, adding component N+1 means:

1. `packages/ui/src/components/<name>/<name>.ts` — the Lit element.
2. `packages/ui/src/components/<name>/<name>.styles.ts` — `static styles`, referencing `--p-*` tokens.
3. `packages/ui/src/components/<name>/<name>.types.ts` — `<Name>Props` / `<Name>JSXProps`.
4. Export it from `src/index.ts`, wrap it in `src/react.ts`, augment `src/jsx.ts`.
5. `docs/admin/<name>.md` — following the documentation template.

## License

MIT
