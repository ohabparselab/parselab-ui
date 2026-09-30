# ParseUI

A drop-in UI library: add one script, wrap your markup in `<parse-ui>`, and plain HTML — `<button>`, `<input>`, headings, tables — renders with ParseUI's design inside a shadow root, isolated from the page's CSS. No framework, no build step required.

> **Status**: v1 styles native elements only (UI variants, no custom event API). Button is the first documented component and the reference architecture for the rest.

## Install

### CDN (JS)

```html
<script src="https://cdn.parseui.com/1.0.0/parseui.min.js"></script>

<parse-ui>
  <button view="primary">Save changes</button>
</parse-ui>
```

### npm

```bash
npm install parseui
```

```tsx
import "parseui";

export function Example() {
  return (
    <parse-ui>
      <button view="primary">Save changes</button>
    </parse-ui>
  );
}
```

See [`packages/parseui/README.md`](./packages/parseui/README.md) for attributes, theming, caveats, and how to add a component.

## Documentation

The docs site lives in [`packages/docs`](./packages/docs) (Remix). Page content is markdown in [`docs/`](./docs) plus component docs in `packages/docs/app/content/components/`.

```bash
npm run docs             # docs site on http://localhost:4326
npm run docs:version     # snapshot docs/ for the current parseui version
```

## Repo layout

```
parselab-ui/
  docs/                  # guide pages (introduction, installation, cdn, npm)
  packages/
    parseui/             # the parseui library
      src/
        core/            # <parse-ui> element, component registry, <parseui> compat
        tokens/          # --p-* design tokens (light / dark / auto)
        base/            # default design for plain tags
        components/      # one folder per component (button/ is the reference)
      examples/          # plain-HTML and React test pages
    docs/                # documentation site
```

## Development

```bash
npm install
npm run build            # builds parseui: dist/parseui.js (ESM) + dist/parseui.min.js (IIFE)
npm run typecheck
```

## License

MIT
