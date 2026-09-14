# Button — `<p-button>`

`Button` is used to trigger an action or navigate to a new location. It's built as a real Web Component (`<p-button>`, powered by [Preact](https://preactjs.com) rendering into a shadow root), registered globally once you import `@parselabllc/ui`, and works in any HTML page or JSX-based framework (React, Next.js, Remix) without a build-time compiler.

Use `Button` for the primary and secondary actions on a page or inside a form. For a button that only shows an icon, always set `accessibilityLabel`.

## Usage

### Raw custom element

```html
<script type="module">
  import "@parselabllc/ui";
</script>

<p-button variant="primary">Save</p-button>
<p-button variant="tertiary" tone="critical">Delete</p-button>
```

### React / Next.js / Remix

```tsx
import { Button } from "@parselabllc/ui/react";

function SaveBar() {
  return (
    <Button variant="primary" onClick={() => save()}>
      Save
    </Button>
  );
}
```

`@parselabllc/ui/react` wraps the element with the `@lit/react` package's `createComponent()` utility (a generic custom-element-to-React adapter, unrelated to what renders the element internally), so `onClick` behaves like a normal React event handler. You can also use the raw tag directly (`<p-button onClick={...}>`) once you `import "@parselabllc/ui"` — a type augmentation ships with the package so the tag type-checks — but the DOM `click` event won't get React's synthetic-event ergonomics that way.

**Plain DOM / vanilla JS**: `<p-button>` also just works with the native `onclick`/`onblur`/`onfocus` properties every element already has, and with `addEventListener`. Nothing custom needed:

```js
document.querySelector('p-button').onclick = () => save();
```

### Next.js (App Router) — import it client-only

`<p-button>` is a custom element, which extends `HTMLElement` at module scope — true of every Web Component library, not specific to how `@parselabllc/ui` renders internally. Next.js evaluates "use client" modules on the server too (to produce the initial HTML), and Node has no real `HTMLElement` global — importing it directly at the top of a "use client" file throws. Load it with `next/dynamic` and `ssr: false` instead, which is the standard Next.js pattern for browser-only libraries:

```tsx
"use client";
import dynamic from "next/dynamic";

const Button = dynamic(() => import("@parselabllc/ui/react").then((m) => m.Button), {
  ssr: false,
});
```

This is a tested, confirmed-working pattern (verified twice against Next.js 16 / Turbopack — once on an earlier Lit-based build, and again after the component was rewritten on Preact, same result both times). Full SSR — `<p-button>` rendering real markup in the server-generated HTML, no client-only gate needed — is tracked in `PLAN.md`'s SSR section as a follow-up.

### Remix

Unlike Next.js, Remix does **not** need the `ssr: false` client-only gate — `import { Button } from "@parselabllc/ui/react"` works directly in a route module, server-evaluated and all:

```tsx
import { Button } from "@parselabllc/ui/react";

export default function SaveBar() {
  return (
    <Button variant="primary" onClick={() => save()}>
      Save
    </Button>
  );
}
```

Verified against a Remix 2 (Vite plugin) app in `packages/docs` of this repo. Two things are required for this to work, both already handled inside `@parselabllc/ui` / this repo — worth knowing if you hit either in your own Vite-based SSR setup:

- **`HTMLElement` in Node.** `@lit-labs/ssr-dom-shim` only auto-patches `globalThis.Event`/`CustomEvent`; `HTMLElement` and `customElements` are exported for the caller to assign itself. `@parselabllc/ui`'s internal `dom-shim.ts` does that assignment explicitly.
- **React deduping for workspace-linked packages.** If you consume `@parselabllc/ui` from a monorepo via an npm/pnpm workspace link (as `packages/docs` does here), Vite's dependency optimizer skips linked packages by default, which can load a second `react` module instance and throw `Invalid hook call` during hydration. Add it to `optimizeDeps.include` in the consuming app's `vite.config.ts`:

  ```ts
  export default defineConfig({
    optimizeDeps: { include: ["@parselabllc/ui/react"] },
    resolve: { dedupe: ["react", "react-dom"] },
  });
  ```

  Not needed when installing `@parselabllc/ui` as a normal (non-linked) npm dependency.

Like Next.js, this is still client-side-only rendering — no server-rendered `<p-button>` markup yet (see the SSR follow-up in `PLAN.md`).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'plain'` | `'secondary'` | Visual weight of the button. |
| `tone` | `'neutral' \| 'critical' \| 'auto'` | `'auto'` | Semantic tone; `'critical'` tints the button red (e.g. destructive actions). |
| `disabled` | `boolean` | `false` | Disables the button; suppresses clicks. |
| `loading` | `boolean` | `false` | Shows a spinner and disables interaction, without changing layout width. |
| `href` | `string` | — | Renders the button as a link (`<a>`) pointing to this URL. |
| `target` | `'' \| '_blank' \| '_self' \| '_parent' \| '_top'` | — | Anchor `target`, only applies when `href` is set. |
| `download` | `string` | — | Anchor `download`, only applies when `href` is set. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button `type`, ignored when `href` is set. |
| `accessibilityLabel` | `string` | `''` | Accessible label (maps to `aria-label`). Required for icon-only buttons. |
| `icon` | `string` | `''` | Reserved for `<p-icon>` integration once that component ships — typed and reflected today, not yet rendered. |
| `lang` | `string` | `''` | BCP 47 language tag (e.g. `'en'`, `'fr'`), for correct assistive-technology pronunciation. |
| `command` | `'--auto' \| '--show' \| '--hide' \| '--toggle'` | `'--auto'` | Declarative action to take on the element referenced by `commandFor`, via the [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement/command). Only meaningful when `commandFor` is set. |
| `commandFor` | `string` | `''` | The `id` of another component this button controls (e.g. a future Modal) — forwarded onto the native rendered element as `commandfor`, no custom event wiring needed. |
| `interestFor` | `string` | `''` | The `id` of a component to signal "interest" in (Open UI interest-invokers proposal) — forwarded as `interestfor`. |

Every prop above always has a real value at runtime (no `undefined`) — an empty string / `false` / the default enum value, matching the table's Default column. This mirrors Shopify's own `<s-button>` contract, where the underlying `ButtonProps` type is fully `Required`, not optional.

## Events

| Event | Detail | Fires when |
|---|---|---|
| `click` (`onClick` via `@parselabllc/ui/react`) | `CustomEvent<undefined>` | The button is activated by mouse, touch, or keyboard — never fires while `disabled` or `loading`. |
| `focus` (`onFocus`) | `CustomEvent<undefined>` | The button receives focus. |
| `blur` (`onBlur`) | `CustomEvent<undefined>` | The button loses focus. |

These are also available as plain, native `onclick`/`onblur`/`onfocus` properties (every `HTMLElement` has them) and via `addEventListener` — nothing `@parselabllc/ui`-specific is needed for those; `onClick`/`onFocus`/`onBlur` above are only the React-facing callback shape.

## CSS custom properties

`Button`'s default look matches Shopify Polaris's own default button (light-mode values below are Polaris's actual tokens, verbatim from `@shopify/polaris-tokens`; dark-mode is this package's own adaptation — Polaris itself has no official dark theme). It reads from the shared `@parselabllc/ui` token sheet (`@parselabllc/ui/tokens.css`), with hard-coded fallbacks if you never load it:

| Property | Default (light) | Description |
|---|---|---|
| `--p-color-primary` / `-hover` / `-active` | `#303030` / `#1a1a1a` / `#1a1a1a` | Background for `variant="primary"`; also `variant="plain"`'s text color. |
| `--p-color-critical` / `-hover` / `-active` | `#c70a24` / `#a30a24` / `#8e0b21` | Background for `variant="primary" tone="critical"`. |
| `--p-color-critical-text` | `#8e0b21` | Text color for `tone="critical"` on non-primary variants (same color at every state). |
| `--p-color-neutral` / `-hover` / `-active` | `#ffffff` / `#fafafa` / `#f7f7f7` | Background for `variant="secondary"` (default). |
| `--p-color-surface-hover` / `-active` | `rgba(0,0,0,.05)` / `rgba(0,0,0,.08)` | Hover/active fill for `variant="tertiary"`. |
| `--p-color-text` | `#303030` | Text color for `secondary`/`tertiary` variants. |
| `--p-color-text-on-primary` | `#ffffff` | Text color for `variant="primary"`. |
| `--p-color-focus-ring` | `#005bd3` | `:focus-visible` outline color, independent of variant/tone. |
| `--p-radius-md` | `8px` | Corner radius. |
| `--p-space-small` / `--p-space-large` | `0.375rem` / `0.75rem` | Vertical / horizontal padding. |
| `--p-font-family`, `--p-font-size-base`, `--p-font-weight-medium` | `'Inter', ...` / `0.75rem` / `550` | Typography. |

## Slots / parts

- **default slot** — the button's label content (text, or an icon + text).
- `::part(base)` — the internal `<button>` (or `<a>`, when `href` is set) element, for style overrides beyond what tokens cover.
- `::part(spinner)` — the loading spinner, only present while `loading`.

## Accessibility

- Always set `accessibilityLabel` on icon-only buttons — there's no visible text for assistive tech to read otherwise.
- `loading` sets `aria-busy="true"` and disables the button so it isn't double-activated mid-action.
- Keyboard: focusable via Tab, activates on Enter/Space like a native `<button>`; when `href` is set it activates like a native `<a>` instead (Enter only, and it's not skipped by button-specific AT navigation).
- Focus is shown with a visible outline (`:focus-visible`), not suppressed.
