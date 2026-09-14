# Getting started

`@parselabllc/ui` is Parselab's Web Component UI library — real custom elements (`<p-button>`, ...), built with [Preact](https://preactjs.com) rendering into a shadow root, usable from any React-based framework (Next.js, Remix) or plain HTML, with no framework lock-in.

## Install

```bash
npm install @parselabllc/ui
```

## Usage

### React / Next.js / Remix (recommended)

```tsx
import { Button } from "@parselabllc/ui/react";

<Button variant="primary" onClick={() => save()}>
  Save
</Button>;
```

### Raw custom element (any framework, or plain HTML)

```tsx
import "@parselabllc/ui";

<p-button variant="primary" onClick={() => save()}>
  Save
</p-button>;
```

### Next.js (App Router)

Import via `next/dynamic` with `ssr: false` — Next evaluates "use client" modules on the server too, and custom elements need a real browser `HTMLElement` at import time. See the [Button docs](/docs/components/button#nextjs-app-router--import-it-client-only) for the tested pattern.

### Remix

No client-only gate needed — `import { Button } from "@parselabllc/ui/react"` works directly in a route module. See the [Button docs](/docs/components/button#remix) for the two setup notes that make this work in a Vite-based monorepo.

## Theming

```css
:root {
  --p-color-primary: #16a34a;
}
```

Or import the default token sheet and override from there:

```ts
import "@parselabllc/ui/tokens.css";
```

## Repo layout

```
parselab-ui/
  PLAN.md              # architecture, decisions, and roadmap — read this first
  docs/admin/           # per-component documentation
  packages/ui/          # the @parselabllc/ui package itself
    src/
      components/       # one folder per component: <name>.ts, .styles.ts, .types.ts
      internal/          # preact-custom-element.ts (base class + reflect() decorator), shared.ts (shared prop palette)
      tokens/            # public design-token CSS sheet
      index.ts           # registers every element (side effect)
      react.ts            # @lit/react wrappers, React-idiomatic props/events
      jsx.ts               # React JSX IntrinsicElements typings
  packages/docs/        # this docs site (Remix)
```

## Development

```bash
npm install
npm run build            # builds @parselabllc/ui: JS (esm+cjs), types, custom-elements.json
npm run typecheck
```

## Contributing a new component

Every component follows the exact shape `button/` establishes — see [`PLAN.md`](https://github.com/parselab/parselab-ui/blob/main/PLAN.md#component-pattern--mirrors-shopifys-own-architecture) for the full pattern. In short, adding component N+1 means:

1. `packages/ui/src/components/<name>/<name>.ts` — the Preact-based element, extending `PreactCustomElement`.
2. `packages/ui/src/components/<name>/<name>.styles.ts` — a plain CSS string, referencing `--p-*` tokens.
3. `packages/ui/src/components/<name>/<name>.types.ts` — `<Name>Props` / `<Name>JSXProps`.
4. Export it from `src/index.ts`, wrap it in `src/react.ts`, augment `src/jsx.ts`.
5. `docs/admin/<name>.md` — following the documentation template, and a route under `packages/docs/app/routes/docs.components.<name>.tsx`.
