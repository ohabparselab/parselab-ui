# `@parselab/ui` — Parselab Web Component Library

## Context

The Parselab team wants its own reusable UI component library, architecturally modeled on `@shopify/ui-extensions` (confirmed via direct inspection of `node_modules/@shopify/ui-extensions` in this repo): real **Web Components** (custom elements) registered globally and consumed directly as JSX tags — e.g. `<p-button>` instead of Shopify's `<s-button>` — rather than a conventional React component library like `@shopify/polaris`.

This is **not** part of the `optionia-shopify-app` monorepo. It's a brand-new, standalone project at `/Users/abdulohab/projects/packages/parselab/parselab-ui`, published publicly to **npmjs.com** under the `@parselab` scope so anyone — the team, or any external Next.js/Remix project — can `npm install @parselab/ui`.

Decisions already made with the user:
- **Architecture**: Web Components under the hood (not plain React components).
- **Runtime**: **Lit** (not Preact, unlike Shopify — Lit was explicitly chosen for its reactive-property/templating model).
- **Initial scope (revised)**: publish **only `<p-button>`** first — prove the entire chain (component → types → docs → build → npm publish → real-world install) on one component before extending. Full parity with Shopify's 62 admin-surface components is the long-term roadmap, added one component at a time after Button ships successfully, each following the exact same file/type/doc template Button establishes.
- **Documentation**: every component needs proper docs (description, props, slots, events, CSS custom properties, usage examples in both raw-tag and React form) written so both humans and AI coding agents can understand the library without this conversation. Docs content lives at a path matching the eventual docs site structure — `docs/admin/<component>.md` — anticipating a future site at `parselab.dev/docs/admin/...`.
- **Location**: `/Users/abdulohab/projects/packages/parselab/parselab-ui`.
- **Publishing**: public npm registry (registry.npmjs.org), scoped package `@parselab/ui`, published with `--access public` (scoped packages default to private otherwise).
- **This plan itself gets copied into the new repo as `PLAN.md`** at initial setup, so any AI/dev opening that repo cold understands its goal and architecture without this conversation.

---

## Repo layout

```
parselab-ui/                     # /Users/abdulohab/projects/packages/parselab/parselab-ui
  PLAN.md                        # this plan, copied in verbatim as the repo's own north-star doc
  docs/
    admin/
      button.md                  # component doc, path anticipates parselab.dev/docs/admin/button
  packages/
    ui/                         # @parselab/ui — publishable package
      src/
        components/
          button/
            button.ts            # Lit implementation, @customElement('p-button')
            button.styles.ts     # static styles, --p-* token references
            button.types.ts      # ButtonProps / ButtonJSXProps (mirrors Shopify's Button.d.ts split)
        internal/                # shared mixins (form-associated behavior, id generation, etc.) — empty until component #2 needs one
        tokens/tokens.css        # public design-token sheet (--p-* custom properties)
        index.ts                 # side-effect imports -> customElements.define(...) — just Button for v1
        react.ts                 # @lit/react createComponent() wrappers — just Button for v1
        jsx.d.ts                 # React JSX IntrinsicElements + HTMLElementTagNameMap augmentation
      custom-elements-manifest.config.mjs
      vite.config.ts
      tsconfig.json
      package.json
  package.json                   # root, npm workspaces: ["packages/*"] (add apps/docs once there's enough to document)
  .github/workflows/publish.yml
  README.md
```

`apps/docs` (a real Storybook or Next.js docs site deployed at `parselab.dev/docs`) is deliberately deferred — not worth building a docs app around one component. The `docs/admin/button.md` content is still written now, in the path the future site will serve, so nothing is thrown away later.

Use plain **npm workspaces** (the team's existing package manager everywhere in `optionia-shopify-app`, per this repo's convention) rather than pnpm/Turborepo — two workspace packages (`ui`, `docs`) don't justify heavier tooling yet.

---

## Component pattern — mirrors Shopify's own architecture

The user pointed at Shopify's own reference implementation as the pattern to replicate exactly, for extensibility:
`frontend/optionia-app/node_modules/@shopify/ui-extensions/src/surfaces/admin/components/Button.d.ts`

That file's shape (confirmed by direct inspection earlier in this session):
```ts
declare const tagName = 's-button';
export interface ButtonProps extends ButtonBaseProps {
  tone: 'neutral' | 'critical' | 'auto';        // @default 'auto'
  icon: IconProps['type'];                       // @default ''
}
export interface ButtonJSXProps extends Partial<ButtonProps>, Pick<ButtonProps$1, 'id' | 'children'> {
  children?: ComponentChildren;
  onClick?: ((event: CallbackEvent<'s-button'>) => void) | null;
  onFocus?: ((event: CallbackEvent<'s-button'>) => void) | null;
  onBlur?: ((event: CallbackEvent<'s-button'>) => void) | null;
  accessibilityLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'plain';  // @default 'secondary'
  target?: '' | '_blank' | '_self' | '_parent' | '_top';
  href?: string;
  download?: string;
  type?: 'button' | 'submit' | 'reset';          // @default 'button'
  lang?: string;
}
declare global {
  interface HTMLElementTagNameMap { [tagName]: Button; }
}
declare module 'preact' {
  namespace createElement.JSX {
    interface IntrinsicElements { [tagName]: ButtonJSXProps & PreactBaseElementPropsWithChildren<Button>; }
  }
}
```

`@parselab/ui`'s `p-button` replicates this **exact three-part split** — a runtime props interface, a separate JSX-facing props interface, and global JSX-namespace/tag-map augmentation — so any component built this way later (extending props, adding a new tag) follows the same convention Shopify itself uses, just swapping `preact`'s module augmentation for `react`'s and the `s-` prefix for `p-`:

One folder per component: the Lit implementation (`button.ts`), its styles (`button.styles.ts`), and its types (`button.types.ts` — the `ButtonProps`/`ButtonJSXProps` split, kept separate from the class exactly as Shopify keeps its `.d.ts` separate from build output).

```ts
// components/button/button.types.ts
export interface ButtonProps {
  tone?: 'neutral' | 'critical' | 'auto';        // default 'auto'
  variant?: 'primary' | 'secondary' | 'tertiary' | 'plain'; // default 'secondary'
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  target?: '' | '_blank' | '_self' | '_parent' | '_top';
  download?: string;
  type?: 'button' | 'submit' | 'reset';
  accessibilityLabel?: string;
}
export interface ButtonJSXProps extends Partial<ButtonProps> {
  children?: React.ReactNode;
  onClick?: ((event: CustomEvent) => void) | null;
  onFocus?: ((event: CustomEvent) => void) | null;
  onBlur?: ((event: CustomEvent) => void) | null;
}
```

```ts
// components/button/button.ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './button.styles.js';
import type { ButtonProps } from './button.types.js';

const tagName = 'p-button';

@customElement(tagName)
export class PButton extends LitElement implements ButtonProps {
  static styles = styles;

  @property() variant: ButtonProps['variant'] = 'secondary';
  @property() tone: ButtonProps['tone'] = 'auto';
  @property() icon?: string;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) loading = false;
  @property({ attribute: 'accessibility-label' }) accessibilityLabel?: string;
  @property() href?: string;
  @property() target?: ButtonProps['target'];
  @property() download?: string;
  @property() type: ButtonProps['type'] = 'button';

  render() {
    return html`<button ?disabled=${this.disabled || this.loading} part="base" aria-label=${this.accessibilityLabel ?? ''}>
      <slot></slot>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: PButton;
  }
}
```

`jsx.d.ts` then does for React what Shopify's `Button.d.ts` does for Preact — augments the framework's own JSX namespace with the `ButtonJSXProps` from `button.types.ts`:
```ts
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'p-button': ButtonJSXProps & React.DetailedHTMLProps<React.HTMLAttributes<PButton>, PButton>;
    }
  }
}
```

Every other component in the core set (Text, TextField, Select, Checkbox, Switch, Card, Badge, Banner, Modal, Spinner, Icon, Divider, Stack, Box, Grid, Avatar) follows this identical three-file shape (`*.ts`, `*.styles.ts`, `*.types.ts`), which is exactly what makes the library mechanically extensible later — adding component #18 means adding one more folder in the same shape, not inventing a new pattern.

Theming via CSS custom properties in `button.styles.ts`:
```ts
export default css`
  :host { --_bg: var(--p-color-primary, #4f46e5); --_radius: var(--p-radius-md, 6px); }
  button { background: var(--_bg); border-radius: var(--_radius); }
`;
```
Public tokens (`--p-color-primary`, `--p-radius-md`, ...) live in `tokens/tokens.css`; components reference them with fallbacks. Expose `part="base"` (and more as needed) so consumers can style past the token layer via `::part()`. This mirrors Shopify's token/tone/variant vocabulary but implemented as real CSS custom properties instead of a host-controlled design system.

## React integration

Two consumption paths, both shipped from the same package (mirrors Shopify's own `./preact` subpath pattern):

1. **Raw tags** — `jsx.d.ts` augments `react`'s JSX namespace so `<p-button variant="primary">` type-checks in any `.tsx` file once `@parselab/ui` is imported for its registration side effects.
2. **`@parselab/ui/react`** — thin wrappers generated with Lit's official `@lit/react` `createComponent()`, one per element, mapping DOM CustomEvents to normal-feeling `onClick`/`onChange` props. This is what most consumers should actually import (`import { Button } from '@parselab/ui/react'`), since raw custom elements don't get React's synthetic-event ergonomics for custom events even on React 19.

## Documentation template

Every component gets one `docs/admin/<component>.md` written to the same structure Shopify itself uses for its component docs (props/examples split, per the `examples/*.html`/`*.jsx` pattern found in `@shopify/ui-extensions`'s own source), so it's equally useful to a human skimming the future site and to an AI agent reading it as reference:

```md
# Button — `<p-button>`

One-paragraph description: what it's for, when to use it vs. alternatives (e.g. Clickable/Chip once those exist).

## Usage

### Raw custom element
​```html
<p-button variant="primary">Save</p-button>
​```

### React
​```tsx
import { Button } from '@parselab/ui/react';

<Button variant="primary" onClick={() => save()}>Save</Button>
​```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'plain'` | `'secondary'` | ... |
| `tone` | `'neutral' \| 'critical' \| 'auto'` | `'auto'` | ... |
| `disabled` | `boolean` | `false` | ... |
| `loading` | `boolean` | `false` | ... |
| ... | | | |

## Events

| Event | Detail | Fires when |
|---|---|---|
| `onClick` | `CustomEvent` | ... |

## CSS custom properties

| Property | Default | Description |
|---|---|---|
| `--p-color-primary` | `#4f46e5` | Background color for `variant="primary"` |

## Slots / parts

- default slot — button label content
- `::part(base)` — the internal `<button>` element, for style overrides beyond tokens

## Accessibility

Notes on `accessibilityLabel`, keyboard behavior, focus states.
```

This template is the reusable unit — component #2 onward means writing `button.ts`/`.styles.ts`/`.types.ts` plus one more `docs/admin/<name>.md` following this exact shape, nothing new to invent.

## Build tooling

- **Vite (library mode)** for `dist/esm` + `dist/cjs`, entries: `index`, `react` (per-component subpath exports can follow later for finer tree-shaking — not needed for a 17-component v1).
- **`tsc --emitDeclarationOnly`** for `dist/types`.
- **`@custom-elements-manifest/analyzer`** (`cem analyze --litelement`) to generate `dist/custom-elements.json` — powers editor autocomplete for the raw tags and can feed the Storybook docs app.
- `package.json` `exports` map with `types`/`import`/`require` per subpath, `sideEffects` array covering the component files (needed since importing `@parselab/ui` must run `customElements.define(...)`).

## SSR

**Tested finding (this session, Next.js 16 / Turbopack, `<p-button>`)**: importing `@parselab/ui`/`@parselab/ui/react` directly at the top of a `"use client"` file **crashes** the server render (`ReferenceError: HTMLElement is not defined`), not just a cosmetic flash. Root cause: Lit's `ReactiveElement` extends `HTMLElement` at module scope, and Next.js evaluates `"use client"` modules on the server too (to produce the initial HTML); Turbopack resolves `lit`'s package.json export conditions to a browser-oriented build even during that server pass, so real `HTMLElement` is required but absent in Node.

A same-module fix (statically importing `@lit-labs/ssr-dom-shim` before `lit`) does **not** work — ES module imports are hoisted and always evaluate in the order they're *encountered by the module graph*, not the order written in one file, so a shim import can't reliably run before an already-earlier-resolved `lit` import once bundled. Confirmed dependency added anyway (`@lit-labs/ssr-dom-shim`, wired as the first import in `index.ts`/`react.ts`/`button.ts`) since it's harmless and may help in bundlers (plain Node SSR, Vite/Remix) that correctly resolve the "node" condition — not yet verified for Remix in this repo.

**Working, tested workaround**: consumers load the package via `next/dynamic(..., { ssr: false })`, deferring evaluation to the browser entirely — confirmed working end-to-end (renders, `onClick` fires, `--p-color-primary` token override applies) in this session. This is documented in `docs/admin/button.md` and both READMEs.

**Real fix (Phase 2, not yet started)**: full declarative-shadow-DOM SSR via `@lit-labs/ssr` + `@lit-labs/nextjs` (a purpose-built Next.js integration that patches the rendering pipeline to expand custom elements into DSD server-side). Adds real complexity (DSD polyfill for older browsers, streaming-chunk edge cases, hydration-mismatch debugging) — scope as its own effort once there's more than one component to justify it, not blocking further component work.

## Publishing (public npm registry)

```jsonc
// packages/ui/package.json
{
  "name": "@parselab/ui",
  "version": "0.1.0",
  "publishConfig": { "access": "public" },
  "repository": { "type": "git", "url": "git+https://github.com/parselab/parselab-ui.git" }
}
```
Scoped packages (`@parselab/...`) publish **private by default** on npmjs.com — `publishConfig.access: "public"` (or `npm publish --access public` on the first publish) is required, otherwise `npm publish` will fail/attempt a paid-private publish. No custom `.npmrc` registry override is needed since the target is the default registry (`registry.npmjs.org`); consumers install with a plain `npm install @parselab/ui`, no auth required.

Standard-practice setup at scaffold time (this is the "just create the package.json and other setup now" step):
- `package.json` with `name`, `version`, `description`, `license` (MIT is typical for a public OSS-style library), `type: module`, `main`/`module`/`types`/`exports`, `publishConfig.access: public`, `sideEffects`, `files: ["dist"]` (don't publish `src/`).
- `.gitignore` (`node_modules`, `dist`, `.turbo` if added later).
- `README.md` with install/usage (`npm install @parselab/ui`, `import { Button } from '@parselab/ui/react'`).
- `LICENSE`.
- `tsconfig.json` (strict mode, matching the team's existing convention from `optionia-app`).
- `PLAN.md` = this plan document, so the repo is self-describing.

`.github/workflows/publish.yml` — triggered on GitHub Release: checkout → setup-node with `registry-url: https://registry.npmjs.org` → `npm ci` → `npm run build` → `npm publish --access public` using `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` (an npmjs.com automation token created under the `parselab` npm org/account and stored as a repo secret — this is a manual one-time setup step for whoever owns the npm account, flagged here rather than assumed).

Use **Changesets** (`@changesets/cli`) for version bumps + changelog generation from the start — cheap to adopt now, avoids a painful retrofit once external consumers depend on specific versions.

## Initial component set (v1)

**Button only** (`<p-button>` / `@parselab/ui/react`'s `Button`). Everything else on Shopify's 62-component admin-surface list (Text, TextField, Select, Checkbox, Switch, Card, Badge, Banner, Modal, Spinner, Icon, Divider, Stack, Box, Grid, Avatar, ...) is the roadmap, added one at a time after Button is live on npm, each following the exact template Button establishes (component + styles + types + doc).

## Delivery phases

1. **Scaffold** (immediate first step): create the repo at `/Users/abdulohab/projects/packages/parselab/parselab-ui` — root `package.json`, `packages/ui/package.json` + `tsconfig.json` + `.gitignore` + `README.md` + `LICENSE`, this document as `PLAN.md`, and the build pipeline (Vite + tsc + CEM analyzer) config.
2. **Build `<p-button>` end to end**: `button.ts` / `button.styles.ts` / `button.types.ts`, `index.ts` + `react.ts` + `jsx.d.ts` wiring it up, and `docs/admin/button.md` following the documentation template. Confirm `npm run build` produces `dist/esm`, `dist/cjs`, `dist/types`, `dist/custom-elements.json` cleanly.
3. **Publish v0.1.0** to npmjs.com (`@parselab/ui`, `--access public`). Note: publishing under the `@parselab` scope requires that scope to actually be registered/owned on npmjs.com — confirm access to that account before the first real `npm publish`.
4. **Validate**: install `@parselab/ui` fresh into a throwaway Next.js (or Remix) app and confirm `<p-button>` / `<Button>` renders, handles `onClick`, and responds to `--p-color-primary` token overrides — this is the real proof the architecture works before extending further.
5. **Extend component-by-component** toward the full 62-component set, in whatever priority order the team hits real needs for (e.g. mirror `optionia-app-admin`'s existing `pf-*` hand-rolled elements first, since those are known, live replacement targets).
6. **Later**: a real docs site at `parselab.dev/docs/admin` serving the `docs/admin/*.md` content once there's enough surface area to justify it; SSR via `@lit-labs/ssr`/`@lit-labs/nextjs`.

## Verification

- [x] `npm run build` in `packages/ui` produces `dist/esm`, `dist/cjs`, `dist/types`, `dist/custom-elements.json` with no type errors. Confirmed this session.
- [x] `docs/admin/button.md` exists and matches the documentation template (usage, props table, events, CSS custom properties, slots/parts, accessibility). Confirmed this session, including a Next.js-specific usage caveat (see SSR section).
- [x] A throwaway Next.js 16/Turbopack app installing the packed tarball, importing `@parselab/ui/react`'s `Button` via `next/dynamic({ ssr: false })`, renders all variants/tones/states, responds to `onClick` (click counter incremented correctly), and reflects a `--p-color-primary` token override (green vs. default indigo) — confirmed visually in the Browser pane this session. Direct (non-dynamic) import crashes SSR — see SSR section for why and the workaround.
- [x] `npm publish --dry-run --access public` succeeds against the public npm registry, tarball contents verified correct (README, LICENSE, dist/* all present) — confirmed this session.
- [ ] CI workflow (`publish.yml`) runs green on a tagged pre-release before cutting `v0.1.0` — not yet run; requires `NPM_TOKEN` secret to be configured on the GitHub repo first (repo doesn't exist on GitHub yet either — local only so far).
