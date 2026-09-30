# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

ParseUI: a drop-in UI kit. Markup inside `<parse-ui>` renders in a shadow root with ParseUI's design — plain `<button>`, `<input>`, headings, tables, plus `<i icon="name">` icons. npm workspaces monorepo:

- `packages/parseui` — the library (`parseui` on npm)
- `packages/icons` — `@parseui/icons` (icon set + React components)
- `packages/docs` — docs site (Remix + Vite), package `@parselabllc/docs`
- `docs/*.md` — Markdown for the docs site's Getting-started pages

**Design rule:** ParseUI's default design follows shadcn/ui (base-nova style, neutral theme). Before building or restyling a component, read `design/DESIGN.md` (tokens, scales, shared focus/invalid/disabled conventions, how shadcn parts map to native HTML, and ParseUI's deliberate deviations) and that component's classes in `design/shadcn-base-nova.md`.

`PLAN.md` is **outdated** (describes the old `@parselabllc/ui` / `<p-button>` Preact design that was removed). Don't follow it.

## Commands

```bash
npm run build        # @parseui/icons, then parseui (both needed before docs typecheck)
npm run typecheck    # parseui + docs (tsc)
npm run docs         # docs dev server, http://localhost:4326
npm run build:icons  # rebuild icons after editing packages/icons/svg/*.svg
npm run docs:version # snapshot docs/ into docs/versions/<parseui version>/
```

There is no test suite or linter. Verify in a browser: `.claude/launch.json` defines `docs` (4326), `parseui-examples` (4330, serves `packages/` — test page at `/parseui/examples/index.html`, uses the built `dist/cdn` file and local icon SVGs), and `parseui-react-example` (4331, React-reconciliation check). Rebuild parseui (`npm run build`) before checking the example pages.

After changing a package's `package.json` exports/paths, restart the docs dev server — Vite caches the old resolution.

## Distribution model (important)

All library code is served from the CDN only; npm ships a loader. `packages/parseui` builds twice (`vite.config.ts`, mode switch):

- `src/index.ts` → `dist/cdn/parseui.min.js` (IIFE, `window.ParseUI`) — the entire library, uploaded to `https://cdn.parseui.com/<version>/`.
- `src/loader.ts` → `dist/npm/parseui.js` — what `import "parseui"` runs: injects the CDN script for the *installed version* and proxies `registerComponent` / `registerIcons` / `setIconBaseUrl`. **It may only `import type` from the library**, or library code leaks into the npm bundle.

Calls made before the script loads are queued on a `window.ParseUI = { q: [...] }` stub (`src/core/api.ts`); the CDN build replays the queue after registering built-ins and **before** defining `<parse-ui>`, so they apply before first render. npm `files` exclude `dist/cdn`. Release order: upload `dist/cdn/` to the CDN **before** `npm publish` (publish workflow comments say so). The CDN isn't live yet.

## parseui architecture

- `core/parse-ui.ts` — the `<parse-ui>` element: open shadow root, moves light-DOM children into it (plus a MutationObserver for parser/JS-added children), and forwards DOM methods/accessors (`appendChild`, `insertBefore`, `childNodes`, `innerHTML`, …) to the shadow content so React/Vue reconcile correctly. `core/compat.ts` converts `<parseui>` tags (not a valid custom-element name) to `<parse-ui>`.
- `core/registry.ts` — everything, including tokens and base styles, is a `ComponentDefinition { name, css, setup?(shadowRoot) }` registered via `registerComponent`. Each `<parse-ui>` adopts all sheets and runs all `setup`s; later registrations apply live. Order matters (later sheets win ties): tokens → base → button → icon, in `src/index.ts`.
- `tokens/tokens.ts` — `--p-*` custom properties on `:host`. Light by default; `theme="dark"` forces dark, `theme="auto"` follows the OS. Hover/soft/ring colors are `color-mix()`es of base tokens, so overriding e.g. `--p-color-primary` on `parse-ui` recolors all states.
- `components/button/` — the reference component pattern. Styles native `button`, `input[type=button|submit|reset]`, `a[view]` (`BUTTON_SELECTOR`). A button with no `view` is white with a thin border (shadcn outline look); `view` = primary/secondary/gray/light/dark/soft/ghost/success/warning/info/danger/link, `outline` (any view, driven by each view's `--_accent`), plus `size`, `icon-only`, `full-width`, `loading`, `disabled`. `components/input/` styles text inputs/select/textarea/file (`TEXT_CONTROL`) plus `[field]` / `[field-group]` layouts, with invalid/disabled/required label styling via `:has()` on the native control. `components/button-group/` styles `[group]` wrappers (buttons and text controls join) (joined borders, dividers for `FILLED_VIEWS`, `aria-pressed`/`aria-current` = selected) and must stay registered after button. Variants only set private `--_*` variables that the base/state rules read; `box-shadow` is always `var(--_shadow-now), var(--_ring-now)` so hover/press elevation and the focus ring don't override each other. `setup` blocks clicks on `[loading]` and syncs `aria-busy`.
- `components/icon/` + `core/icons.ts` — `<i icon="name" size stroke-width>` renders an SVG from icons registered in memory (`registerIcons`), else fetches `${iconBaseUrl}${name}.svg` (default `https://cdn.parseui.com/icons/1.0.0/`), sanitized and cached. Only the `<svg>` inside the `<i>` is script-owned.
- `src/jsx.ts` → `parseui/jsx` — React type augmentation. Presence-only attributes need `=""` in JSX (`loading=""`). React `onClick` on elements *inside* `<parse-ui>` does not fire (events retarget at the shadow boundary); native listeners work.

## @parseui/icons

Seeded from Lucide (ISC — `LICENSE-lucide` must ship; names match lucide-react) and redrawn by designers over time. Sources: `packages/icons/svg/<kebab-name>.svg` (24×24; the file name is the icon name everywhere), `aliases.json` (Lucide's old names → current), `tags.json` (search words). `scripts/build.mjs` validates (grid, no scripts/handlers), rewrites the root `<svg>` to the standard stroke attributes, and generates `dist/svg/*.svg` (CDN files, aliases included), `dist/icons.json`, `dist/tags.json`, `dist/index.js` (PascalCase React components incl. alias exports, `<Icon name>`, `icons`, `iconNames`, `aliases`, `toSvg`; each icon's markup is its own const and components are `/*#__PURE__*/` so imports tree-shake — keep it that way; helpers live in `dist/runtime.js` because exports like `Map`/`Infinity`/`Image` shadow globals) and `dist/index.d.ts`. `scripts/import-lucide.mjs <lucide-static dir> --only-new` adds new Lucide icons without overwriting redrawn ones. Don't edit `dist/`. The docs never bundle the full map on normal pages: previews fetch `/icons/<name>.svg` (served from `dist/svg` by `routes/icons.$file.ts`); only the Icons page imports the set (grid renders in batches of 240).

## Docs site (`packages/docs`)

- **Nav drives everything**: `app/nav.ts` (`NAV`). The first section's items are the Markdown guide pages (`GUIDE_SLUGS` → `docs/<slug>.md`); `/icons`, `/components` (overview grid built from `COMPONENT_NAV`; a nav item's `badge: "New"` also lists it under "New components") and `/components/*` are React pages with their own routes. Remix flat routes: static segments beat `$page`/`$version`, and each page has an unversioned route plus a `docs.$version.*` twin (`next` = current `docs/`; snapshots live in `docs/versions/<v>/`).
- **Component docs are data**: `app/content/components/<name>.ts` (a `ComponentDoc`), registered in `content/components/index.ts`, rendered by `ComponentPage` — the first example (id `default`) is shown right under the page header, the rest under "Examples"; component pages have no Installation/Usage sections. Examples are written once as plain HTML markup; `content/code.ts` `exampleVariants()` derives the **CDN (JS)** and **npm** code tabs from it (`toJsx` handles presence-only attrs and SVG camelCase). Each `CodeTabs` block switches independently.
- Syntax highlighting (Shiki) runs only on the server (`lib/*.server.ts`); loaders pass pre-highlighted HTML to components.
- Previews (`PreviewCard`) set `<parse-ui>`'s `innerHTML` imperatively so React never reconciles its children.
- The docs load ParseUI exactly like an npm user, via `lib/parseui.client.ts` (imported from `root.tsx`), pointed at this repo's CDN build served by the `routes/parseui[.]min[.]js.ts` route (override with `VITE_PARSEUI_SRC`). Previews register icons from `@parseui/icons`, so they make no CDN requests.
- Search: `/api/search` returns an index built by `lib/search.server.ts` (guide sections from Markdown, component examples/API tables, icon names); client ranking lives in `lib/search.ts`. **New page types need their own entries there.** Heading anchors must use the shared `lib/slugify.ts`.
- Site theme uses `data-theme` on `<html>` plus `prefers-color-scheme`; tokens in `app/styles/docs.css`.

## Adding a component

1. `packages/parseui/src/components/<name>/` exporting a `ComponentDefinition`; register it in `src/index.ts`; add attribute types to `src/jsx.ts`.
2. `packages/docs/app/content/components/<name>.ts` + entry in `content/components/index.ts` + a `NAV` item under Components.
3. Update `packages/parseui/README.md` and, if user-facing, `docs/introduction.md`.

## Publishing

Releases run on the server, not in CI: code is pushed to GitHub, the server pulls it and runs `CDN_ROOT=/var/www/cdn.parseui.com npm run release` (`scripts/release.sh`: pull → `npm ci` → build/typecheck → copy `dist/cdn` and icon SVGs to `$CDN_ROOT/<version>/` and `$CDN_ROOT/icons/<version>/` → verify the CDN URLs → `npm publish` @parseui/icons then parseui). CDN and npm versions are immutable, so every release bumps `package.json` versions first. The icon CDN version compiled into parseui comes from `packages/icons/package.json` (`__PARSEUI_ICONS_VERSION__`). Full procedure and server setup: `RELEASING.md`. CI (`ci.yml`) only runs `npm ci`, `npm run build`, `npm run typecheck`.
