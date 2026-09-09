# `@parselab/ui` — Parselab Web Component Library

## Context

The Parselab team wants its own reusable UI component library, architecturally modeled on `@shopify/ui-extensions` (confirmed via direct inspection of `node_modules/@shopify/ui-extensions` in this repo): real **Web Components** (custom elements) registered globally and consumed directly as JSX tags — e.g. `<p-button>` instead of Shopify's `<s-button>` — rather than a conventional React component library like `@shopify/polaris`.

This is **not** part of the `optionia-shopify-app` monorepo. It's a brand-new, standalone project at `/Users/abdulohab/projects/packages/parselab/parselab-ui`, published publicly to **npmjs.com** under the `@parselab` scope so anyone — the team, or any external Next.js/Remix project — can `npm install @parselab/ui`.

Decisions already made with the user:
- **Architecture**: Web Components under the hood (not plain React components).
- **Runtime**: **Preact** (revised from an earlier Lit-based draft, once byte-for-byte architecture parity with Shopify's own `<s-button>` was reviewed in detail — Preact renders into the shadow root, and properties are native TC39 `accessor` class fields with a custom `reflect()` decorator providing property↔attribute sync, matching the mechanism Shopify's own (unpublished) `PreactCustomElement` base class is documented as providing. See "Component pattern" below.).
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
            button.ts            # Preact implementation, @customElement('p-button')
            button.styles.ts     # plain CSS string, --p-* token references
            button.types.ts      # ButtonProps / ButtonJSXProps (mirrors Shopify's Button.d.ts split)
        internal/
          preact-custom-element.ts # PreactCustomElement base class + reflect()/customElement() decorators
          shared.ts               # shared prop palette (SharedProps, InteractionProps, Tone) — mirrors Shopify's shared.d.ts
          dom-shim.ts              # @lit-labs/ssr-dom-shim import, see SSR section
        tokens/tokens.css        # public design-token sheet (--p-* custom properties)
        index.ts                 # side-effect imports -> customElements.define(...) — just Button for v1
        react.ts                 # @lit/react createComponent() wrappers — just Button for v1
        jsx.ts                   # React JSX IntrinsicElements + HTMLElementTagNameMap augmentation
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

That file's shape (confirmed by direct inspection):
```ts
declare const tagName = 's-button';
export type ButtonBaseProps = Required<Pick<ButtonOnlyProps, 'accessibilityLabel' | 'disabled' | 'command' | 'commandFor' | 'icon' | 'interestFor' | 'lang' | 'loading' | 'type' | 'tone' | 'variant' | 'target' | 'href' | 'download'>>;
export interface ButtonProps extends ButtonBaseProps {
  tone: Extract<ButtonProps$1['tone'], 'neutral' | 'critical' | 'auto'>;  // @default 'auto'
  icon: IconProps['type'];                                                // @default ''
}
declare class Button extends Button_base implements ButtonProps {
  accessor disabled: ButtonProps['disabled'];
  accessor variant: ButtonProps['variant'];
  accessor onclick: CallbackEventListener<typeof tagName> | null;
  // ...one `accessor` field per prop, including onclick/onblur/onfocus
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

Three things this session initially got wrong, corrected after closer comparison against this file (see chat history for the full walkthrough) — this is the authoritative, current state:

1. **Runtime**: `PButton extends PreactCustomElement extends HTMLElement`, mirroring `Button extends Button_base extends PreactCustomElement extends HTMLElement` — Preact renders into a shadow root, not Lit. Shopify's actual internal `PreactCustomElement`/property-reflection implementation is never published (only its `.d.ts` type shape ships), so `internal/preact-custom-element.ts` is our own from-scratch implementation of the same *contract*, not a port of their code.
2. **Properties are native `accessor` class fields**, decorated with our own `reflect()` (see below) — matching Shopify's `accessor disabled: ...` pattern, not Lit's `@property()`.
3. **A shared prop palette exists now** (`internal/shared.ts`: `SharedProps`, `InteractionProps`, `Tone`), mirroring Shopify's `shared.d.ts` (`ButtonProps$1`, `IconProps$1`, `InteractionProps`) that every component's own `.d.ts` `Pick`/`Extract`s from. Introduced with only Button consuming it, so the pattern is established before component #2 needs it.

One correction that went the other way — `.onclick`/`.onblur`/`.onfocus` are **not** reimplemented as custom `accessor` fields on `PButton`, unlike Shopify's `Button`. Every custom element already inherits real, working `onclick`/`onblur`/`onfocus` from `HTMLElement`'s native `GlobalEventHandlers` (confirmed in this session: `element.onclick = fn` fires correctly with zero code on our side). Shopify redeclaring them is most plausibly just a *type* override (`CallbackEventListener<'s-button'>` gives a strongly-typed `currentTarget` vs. the native handler's generic `MouseEvent` type) — TypeScript won't even allow overriding an inherited member with an incompatible signature at the class level without violating the base type, so reimplementing this the way Shopify's `.d.ts` shape suggests isn't achievable (or necessary) here anyway.

One folder per component: the Preact implementation (`button.ts`), its styles (`button.styles.ts`), and its types (`button.types.ts` — the `ButtonProps`/`ButtonJSXProps` split, matching Shopify's `Required<...>` runtime-props vs. `Partial<ButtonProps>` JSX-props distinction, which an earlier draft of this file blurred by making `ButtonProps` itself optional).

```ts
// internal/shared.ts — the shared palette, mirroring Shopify's shared.d.ts
export type Tone = 'auto' | 'neutral' | 'info' | 'success' | 'caution' | 'warning' | 'critical';
export interface InteractionProps {
  command?: '--auto' | '--show' | '--hide' | '--toggle';
  commandFor?: string;
  interestFor?: string;
}
export interface SharedProps {
  accessibilityLabel?: string;
  disabled?: boolean;
  lang?: string;
}
```

```ts
// components/button/button.types.ts
export interface ButtonProps extends SharedProps, InteractionProps {
  variant: 'primary' | 'secondary' | 'tertiary' | 'plain';   // always has a value — no `?`
  tone: Extract<Tone, 'neutral' | 'critical' | 'auto'>;
  icon: string;
  loading: boolean;
  href: string;
  target: '' | '_blank' | '_self' | '_parent' | '_top';
  download: string;
  type: 'button' | 'submit' | 'reset';
}
export interface ButtonJSXProps extends Partial<ButtonProps> {
  children?: React.ReactNode;
  onClick?: ((event: CustomEvent) => void) | null;
  onFocus?: ((event: CustomEvent) => void) | null;
  onBlur?: ((event: CustomEvent) => void) | null;
}
```

```ts
// components/button/button.ts (abbreviated — see the real file for the full render() and command/interestFor forwarding)
import { h } from 'preact';
import { PreactCustomElement, reflect, customElement, booleanConverter } from '../../internal/preact-custom-element.js';
import styles from './button.styles.js';
import type { ButtonProps } from './button.types.js';

export const tagName = 'p-button';

@customElement(tagName)
export class PButton extends PreactCustomElement implements ButtonProps {
  static styles = styles;

  @reflect() accessor variant: ButtonProps['variant'] = 'secondary';
  @reflect() accessor tone: ButtonProps['tone'] = 'auto';
  @reflect({ converter: booleanConverter }) accessor disabled = false;
  @reflect({ converter: booleanConverter }) accessor loading = false;
  @reflect({ attribute: 'accessibility-label' }) accessor accessibilityLabel = '';
  // ...href, target, download, type, icon, lang, command, commandFor, interestFor

  render() {
    return h('button', { part: 'base', disabled: this.disabled || this.loading }, h('slot', null));
  }
}

declare global {
  interface HTMLElementTagNameMap { [tagName]: PButton; }
}
```

`internal/preact-custom-element.ts` is the piece with no Shopify equivalent to copy from (their real implementation isn't published) — it provides:
- `reflect(options)`: a standard (TC39) accessor decorator giving a field DOM-property + attribute reflection (kebab-case by default, override via `attribute:`) and scheduling a re-render on every write.
- `customElement(tagName)`: a class decorator that claims the `reflect()` registrations accumulated while that class body was evaluating (member decorators always run before a class decorator, synchronously, during one `class {}` evaluation — this ordering is what makes `observedAttributes` correct by the time `customElements.define()` runs) and defines the element.
- `PreactCustomElement`: the base class — shadow root + `adoptedStyleSheets` (constructable stylesheet, cached per class, not re-parsed per instance) in `connectedCallback`; `attributeChangedCallback` syncing attribute→property via the same registry; `requestUpdate()` batching same-tick property writes into one `queueMicrotask`-deferred Preact render pass; on first connect, attributes present in static HTML are read back and win over the class's hardcoded defaults (which already ran, and already reflected themselves onto the attribute, during construction — without this, static HTML like `<p-button variant="primary">` would get silently clobbered back to the default).

**A real build-tooling gotcha hit while implementing this**: Vite/Rollup's `build.target` option (bundle minify/downlevel target) is a *different* knob from esbuild's own per-file TS-transform target — without also setting the top-level `esbuild: { target: 'es2022' }` in `vite.config.ts`, esbuild parses `accessor` as a plain identifier (not the ES2022 keyword) and fails on any decorated accessor field. Fixed; documented inline in `vite.config.ts`.

**A real CSS bug caught by testing the `href` (anchor) render path**: the stylesheet originally targeted the `button` tag directly (`button { ... }`, `button:hover`, etc.), so the `<a>` element rendered when `href` is set got none of it — plain unstyled blue underlined text. Fixed by switching every such selector to `[part="base"]`, which both the `<button>` and `<a>` render paths always carry.

Theming via CSS custom properties in `button.styles.ts` (plain CSS string now, not a Lit `css` tagged template):
```ts
export default `
  :host { --_bg: var(--p-color-primary, #4f46e5); --_radius: var(--p-radius-md, 6px); }
  [part="base"] { background: var(--_bg); border-radius: var(--_radius); }
`;
```
Public tokens (`--p-color-primary`, `--p-radius-md`, ...) live in `tokens/tokens.css`; components reference them with fallbacks. `part="base"` (and more as needed) lets consumers style past the token layer via `::part()`. This mirrors Shopify's token/tone/variant vocabulary but implemented as real CSS custom properties instead of a host-controlled design system.

`command`/`commandFor`/`interestFor` (from `internal/shared.ts`'s `InteractionProps`) are forwarded onto the rendered native element as raw `command`/`commandfor`/`interestfor` HTML attributes when `commandFor`/`interestFor` are set — no custom event-dispatch code on our side. Confirmed forwarding works in this session; the receiving end (a future Modal/Popover implementing the Invoker Commands API) doesn't exist yet, so end-to-end behavior isn't verifiable until it does.

Every other component in the core set (Text, TextField, Select, Checkbox, Switch, Card, Badge, Banner, Modal, Spinner, Icon, Divider, Stack, Box, Grid, Avatar) follows this identical shape (`*.ts`, `*.styles.ts`, `*.types.ts`, drawing from `internal/shared.ts` where applicable) — adding component #18 means adding one more folder in the same shape, not inventing a new pattern.

## React integration

Two consumption paths, both shipped from the same package (mirrors Shopify's own `./preact` subpath pattern):

1. **Raw tags** — `jsx.ts` augments `react`'s JSX namespace so `<p-button variant="primary">` type-checks in any `.tsx` file once `@parselab/ui` is imported for its registration side effects.
2. **`@parselab/ui/react`** — thin wrappers generated with the `@lit/react` package's `createComponent()` utility, one per element, mapping DOM CustomEvents to normal-feeling `onClick`/`onChange` props. `@lit/react` is a generic custom-element-to-React adapter — it doesn't care that our elements use Preact internally rather than Lit, it just works off DOM properties/events. This is what most consumers should actually import (`import { Button } from '@parselab/ui/react'`), since raw custom elements don't get React's synthetic-event ergonomics for custom events even on React 19.

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
- **`@custom-elements-manifest/analyzer`** (`cem analyze`, default plain-class + JSDoc analysis — the `--litelement` plugin flag was dropped along with Lit itself; JSDoc `@prop`/`@fires`/`@csspart`/`@cssprop` tags on the class doc comment feed the manifest correctly without it, confirmed by inspecting the generated `custom-elements.json`) to generate `dist/custom-elements.json` — powers editor autocomplete for the raw tags and can feed the Storybook docs app.
- `package.json` `exports` map with `types`/`import`/`require` per subpath, `sideEffects` array covering the component files (needed since importing `@parselab/ui` must run `customElements.define(...)`).
- **Vite/esbuild gotcha**: `build.target` (bundle minify/downlevel target) and the top-level `esbuild: { target }` (per-file TS-transform target) are separate knobs — without the latter set to `es2022`, esbuild parses the `accessor` keyword as a plain identifier and fails on decorated accessor fields. See `vite.config.ts`.

## SSR

**Tested finding, re-confirmed after the Lit→Preact switch (Next.js 16 / Turbopack, `<p-button>`)**: importing `@parselab/ui`/`@parselab/ui/react` directly at the top of a `"use client"` file **crashes** the server render (`ReferenceError: HTMLElement is not defined`), not just a cosmetic flash — same error, same root cause, verified again on the Preact-based build (not just assumed to carry over). Root cause is **generic to the Custom Elements platform API, not Lit- or Preact-specific**: any base class extending `HTMLElement` at module scope (Lit's `ReactiveElement`, or our own `PreactCustomElement`) throws the moment the module is evaluated in Node, and Next.js evaluates `"use client"` modules on the server too (to produce the initial HTML) — Turbopack resolves the module graph without a real `HTMLElement` global in that pass. Switching rendering engines does not change this.

A same-module fix (statically importing `@lit-labs/ssr-dom-shim` before the custom-element base class) does **not** work — ES module imports are hoisted and always evaluate in the order they're *encountered by the module graph*, not the order written in one file, so a shim import can't reliably run first once bundled. The dependency is kept anyway (`@lit-labs/ssr-dom-shim`, wired as the first import in `index.ts`/`react.ts`) since it's harmless and may help in bundlers (plain Node SSR, Vite/Remix) that correctly resolve the "node" condition — not yet verified for Remix in this repo.

**Working, tested workaround**: consumers load the package via `next/dynamic(..., { ssr: false })`, deferring evaluation to the browser entirely — confirmed working end-to-end twice now (Lit build, and again after the Preact rewrite): renders all variants/tones/states, `onClick` fires, `href` renders as a styled anchor, `--p-color-primary` token override applies. Documented in `docs/admin/button.md` and both READMEs.

**Real fix (Phase 2, not yet started)**: full declarative-shadow-DOM SSR via `@lit-labs/ssr` + `@lit-labs/nextjs` (a purpose-built Next.js integration that patches the rendering pipeline to expand custom elements into DSD server-side) — or an equivalent for Preact if one exists; not yet researched. Adds real complexity (DSD polyfill for older browsers, streaming-chunk edge cases, hydration-mismatch debugging) — scope as its own effort once there's more than one component to justify it, not blocking further component work.

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
2. **Build `<p-button>` end to end**: `button.ts` / `button.styles.ts` / `button.types.ts`, `index.ts` + `react.ts` + `jsx.ts` wiring it up, and `docs/admin/button.md` following the documentation template. Confirm `npm run build` produces `dist/esm`, `dist/cjs`, `dist/types`, `dist/custom-elements.json` cleanly.
   - **Revised mid-flight** (this session, after closer comparison against Shopify's real `Button.d.ts`): rebuilt on Preact instead of Lit, with a from-scratch `internal/preact-custom-element.ts` (`reflect()`/`customElement()` standard decorators) replacing Lit's `@property()`/`@customElement()`, plus `internal/shared.ts` (the shared prop palette), and closed the real prop gaps found (`lang`, `command`/`commandFor`/`interestFor`, the `ButtonProps` required-vs-`Partial<ButtonJSXProps>` split). See "Component pattern" above for the full rationale and the bugs this surfaced (an esbuild/`accessor` build gotcha, a CSS selector bug on the `href` render path) — both fixed and verified.
3. **Publish v0.1.0** to npmjs.com (`@parselab/ui`, `--access public`). Note: publishing under the `@parselab` scope requires that scope to actually be registered/owned on npmjs.com — confirm access to that account before the first real `npm publish`.
4. **Validate**: install `@parselab/ui` fresh into a throwaway Next.js (or Remix) app and confirm `<p-button>` / `<Button>` renders, handles `onClick`, and responds to `--p-color-primary` token overrides — this is the real proof the architecture works before extending further.
5. **Extend component-by-component** toward the full 62-component set, in whatever priority order the team hits real needs for (e.g. mirror `optionia-app-admin`'s existing `pf-*` hand-rolled elements first, since those are known, live replacement targets).
6. **Later**: a real docs site at `parselab.dev/docs/admin` serving the `docs/admin/*.md` content once there's enough surface area to justify it; SSR via `@lit-labs/ssr`/`@lit-labs/nextjs`.

## Verification

- [x] `npm run build` in `packages/ui` produces `dist/esm`, `dist/cjs`, `dist/types`, `dist/custom-elements.json` with no type errors. Confirmed twice this session (Lit build, then again after the Preact rewrite).
- [x] `docs/admin/button.md` exists and matches the documentation template (usage, props table, events, CSS custom properties, slots/parts, accessibility). Confirmed this session, including a Next.js-specific usage caveat (see SSR section).
- [x] A throwaway Next.js 16/Turbopack app installing the packed tarball, importing `@parselab/ui/react`'s `Button` via `next/dynamic({ ssr: false })`, renders all variants/tones/states, responds to `onClick` (click counter incremented correctly), and reflects a `--p-color-primary` token override (green vs. default indigo) — confirmed visually in the Browser pane, twice (Lit build, then re-confirmed after the Preact rewrite, including the `href` anchor path). Direct (non-dynamic) import crashes SSR both times — see SSR section for why and the workaround.
- [x] Plain-HTML custom-element checks (no React/Next.js involved), against the Preact rewrite specifically: property→attribute reflection (`el.variant = 'primary'` → `variant="primary"` attribute, confirmed via `outerHTML`), attribute→property sync after connection (`setAttribute('variant', ...)` → `.variant` updates and re-renders), boolean reflection (`.disabled = true` → attribute *presence*, not `"true"`/`"false"`), static-HTML-attribute-wins-over-class-default on first connect, native inherited `.onclick` firing without any code of ours, and `command`/`commandFor` forwarding onto the rendered native element as raw attributes — all confirmed working in the Browser pane this session.
- [x] `npm publish --dry-run --access public` succeeds against the public npm registry, tarball contents verified correct (README, LICENSE, dist/* all present) — confirmed this session.
- [ ] CI workflow (`publish.yml`) runs green on a tagged pre-release before cutting `v0.1.0` — not yet run; requires `NPM_TOKEN` secret to be configured on the GitHub repo first (repo doesn't exist on GitHub yet either — local only so far).
