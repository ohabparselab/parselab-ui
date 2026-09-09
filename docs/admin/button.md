# Button — `<p-button>`

`Button` is used to trigger an action or navigate to a new location. It's built as a real Web Component (`<p-button>`, powered by [Lit](https://lit.dev)), registered globally once you import `@parselab/ui`, and works in any HTML page or JSX-based framework (React, Next.js, Remix) without a build-time compiler.

Use `Button` for the primary and secondary actions on a page or inside a form. For a button that only shows an icon, always set `accessibilityLabel`.

## Usage

### Raw custom element

```html
<script type="module">
  import "@parselab/ui";
</script>

<p-button variant="primary">Save</p-button>
<p-button variant="tertiary" tone="critical">Delete</p-button>
```

### React / Next.js / Remix

```tsx
import { Button } from "@parselab/ui/react";

function SaveBar() {
  return (
    <Button variant="primary" onClick={() => save()}>
      Save
    </Button>
  );
}
```

`@parselab/ui/react` wraps the element with Lit's `createComponent()`, so `onClick` behaves like a normal React event handler. You can also use the raw tag directly (`<p-button onClick={...}>`) once you `import "@parselab/ui"` — a `jsx.d.ts` type augmentation ships with the package so the tag type-checks — but the DOM `click` event won't get React's synthetic-event ergonomics that way.

### Next.js (App Router) — import it client-only

`<p-button>` is a Lit custom element, which extends `HTMLElement` at module scope. Next.js evaluates "use client" modules on the server too (to produce the initial HTML), and in that server pass `lit` resolves to a build that expects a real browser `HTMLElement` — importing it directly at the top of a "use client" file throws. Load it with `next/dynamic` and `ssr: false` instead, which is the standard Next.js pattern for browser-only libraries:

```tsx
"use client";
import dynamic from "next/dynamic";

const Button = dynamic(() => import("@parselab/ui/react").then((m) => m.Button), {
  ssr: false,
});
```

This is a tested, confirmed-working pattern (verified in this session against Next.js 16 / Turbopack). Full SSR — `<p-button>` rendering real markup in the server-generated HTML, no client-only gate needed — is tracked in `PLAN.md`'s SSR section as a follow-up (`@lit-labs/ssr` + `@lit-labs/nextjs`). Remix and other Vite-based SSR frameworks may not need this workaround, since Vite's SSR dev/build pipeline generally resolves Node-safe conditional exports correctly — not yet verified in this repo.

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
| `accessibilityLabel` | `string` | — | Accessible label (maps to `aria-label`). Required for icon-only buttons. |
| `icon` | `string` | — | Reserved for `<p-icon>` integration once that component ships. |

## Events

| Event | Detail | Fires when |
|---|---|---|
| `click` (`onClick` via `@parselab/ui/react`) | `CustomEvent<undefined>` | The button is activated by mouse, touch, or keyboard — never fires while `disabled` or `loading`. |
| `focus` (`onFocus`) | `CustomEvent<undefined>` | The button receives focus. |
| `blur` (`onBlur`) | `CustomEvent<undefined>` | The button loses focus. |

## CSS custom properties

`Button` reads from the shared `@parselab/ui` token sheet (`@parselab/ui/tokens.css`), with hard-coded fallbacks if you never load it:

| Property | Default | Description |
|---|---|---|
| `--p-color-primary` | `#4f46e5` | Background for `variant="primary"`; text color for `variant="plain"`. |
| `--p-color-primary-hover` | `#4338ca` | Hover background for `variant="primary"`. |
| `--p-color-critical` | `#dc2626` | Background/text for `tone="critical"`. |
| `--p-color-neutral` | `#e5e7eb` | Background for `variant="secondary"` (default). |
| `--p-radius-md` | `6px` | Corner radius. |
| `--p-space-small` / `--p-space-large` | `0.5rem` / `1.25rem` | Vertical / horizontal padding. |
| `--p-font-family`, `--p-font-size-base`, `--p-font-weight-medium` | — | Typography. |

## Slots / parts

- **default slot** — the button's label content (text, or an icon + text).
- `::part(base)` — the internal `<button>` (or `<a>`, when `href` is set) element, for style overrides beyond what tokens cover.
- `::part(spinner)` — the loading spinner, only present while `loading`.

## Accessibility

- Always set `accessibilityLabel` on icon-only buttons — there's no visible text for assistive tech to read otherwise.
- `loading` sets `aria-busy="true"` and disables the button so it isn't double-activated mid-action.
- Keyboard: focusable via Tab, activates on Enter/Space like a native `<button>`; when `href` is set it activates like a native `<a>` instead (Enter only, and it's not skipped by button-specific AT navigation).
- Focus is shown with a visible outline (`:focus-visible`), not suppressed.
