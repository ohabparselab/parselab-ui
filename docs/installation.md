# Installation

Add ParseUI to any page in under a minute — pick the CDN script for plain HTML sites, or the npm package for projects with a bundler.

## Choose a method

### CDN (JS)

One script tag, no build step. Best for plain HTML, CMS themes, and prototypes.

```html
<script src="https://cdn.parseui.com/1.0.0/parseui.min.js"></script>
```

See the full [CDN setup guide](/docs/cdn).

### npm

For projects with a bundler (Vite, Next.js, Remix, webpack).

```bash
npm install parseui@latest
```

The package is a tiny loader: it pulls the same `parseui.min.js` from the CDN, so both methods run identical code.

```js
import "parseui";
```

See the full [npm setup guide](/docs/npm).

## Use it

Wrap any markup in `<parse-ui>`:

```html
<parse-ui>
  <button view="primary">Save changes</button>
  <button view="secondary">Cancel</button>
</parse-ui>
```

## Browser support

ParseUI needs custom elements and shadow DOM — every current version of Chrome, Edge, Firefox, and Safari. Constructable stylesheets are used where available, with an automatic fallback for older Safari.
