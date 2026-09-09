# @parselab/ui

Parselab's own UI component library — real Web Components (`<p-button>`, ...), built with [Lit](https://lit.dev), usable from any React-based framework (Next.js, Remix) or plain HTML.

> **Status**: early. Only `<p-button>` exists today; more components are being added following the same pattern. Full source, docs, and roadmap: https://github.com/parselab/parselab-ui

## Install

```bash
npm install @parselab/ui
```

## Usage

```tsx
import { Button } from "@parselab/ui/react";

<Button variant="primary" onClick={() => save()}>
  Save
</Button>;
```

Or the raw custom element in any framework:

```tsx
import "@parselab/ui";

<p-button variant="primary" onClick={() => save()}>
  Save
</p-button>;
```

> **Next.js (App Router)**: import via `next/dynamic({ ssr: false })` — see the [Button docs](https://github.com/parselab/parselab-ui/blob/main/docs/admin/button.md#nextjs-app-router--import-it-client-only) for why and the exact pattern.

### Theming

```css
:root {
  --p-color-primary: #16a34a;
}
```

Full component docs (props, events, CSS custom properties, accessibility): [`docs/admin/button.md`](https://github.com/parselab/parselab-ui/blob/main/docs/admin/button.md) in the repo.

## License

MIT
