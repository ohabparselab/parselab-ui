# ParseUI design reference

**ParseUI's default design follows shadcn/ui** — specifically the **base-nova** style (what the shadcn docs examples render) with the **neutral** theme. When building or restyling a component, match shadcn's numbers first; deviate only where a ParseUI decision below says so.

- Exact classes for all 63 shadcn components: [`shadcn-base-nova.md`](./shadcn-base-nova.md) (snapshot, 2026-09-30).
- Live source of one component: `https://ui.shadcn.com/r/styles/base-nova/<name>.json` (`files[0].content`).
- Component list: `https://ui.shadcn.com/r/styles/base-nova/registry.json` · theme colors: `https://ui.shadcn.com/r/colors/neutral.json`.
- The docs page for a component (`https://ui.shadcn.com/docs/components/base/<name>`) shows its examples — measure computed styles there to confirm.

## Theme tokens (neutral)

| shadcn token | Light | Dark | Used for |
|---|---|---|---|
| `background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | page, outline button fill |
| `foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | text |
| `card` / `popover` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | cards, menus, dialogs |
| `primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` | default (filled) button, checked controls |
| `primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` | text on primary |
| `secondary` / `muted` / `accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | subtle fills, hover, menu item focus |
| `muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | descriptions, placeholders, labels in menus |
| `destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | errors, destructive actions |
| `border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | dividers, card/table borders |
| `input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` | control borders; dark fills use `input/30` |
| `ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | focus border and ring |
| `radius` | `0.625rem` (10px) | | base of the radius scale |

Global base: every element's border color is `border`, outlines are `ring/50`; `body` is `bg-background text-foreground`.

## Scales (Tailwind v4 as shadcn configures it)

- **Spacing:** 1 unit = `0.25rem` (4px). `px-2.5` = 10px, `gap-1.5` = 6px, `p-4` = 16px.
- **Radius** (from `--radius` = 10px): `rounded-sm` ×0.6 = 6px · `md` ×0.8 = 8px · `lg` = 10px · `xl` ×1.4 = 14px · `2xl` ×1.8 = 18px · `3xl` ×2.2 · `4xl` ×2.6 = 26px (pill) · `rounded-[4px]` for checkboxes, `rounded-full` for switches/avatars.
- **Text:** `xs` 12/16px · `sm` 14/20px · `base` 16/24px · `lg` 18/28px. Controls use `text-sm`; inputs are `text-base md:text-sm`.
- **Leading:** `none` 1 · `tight` 1.25 · `snug` 1.375 · `normal` 1.5.
- **Weight:** labels, buttons, titles `font-medium` (500); body 400.
- **Fonts:** Geist (sans), Geist Mono (mono).
- **Transitions:** 150ms `cubic-bezier(.4,0,.2,1)`; overlays/menus animate in 100ms (fade + zoom-in-95, slide-in-from-side 2 units).
- **Shadows** (Tailwind): `shadow-xs` `0 1px 2px rgb(0 0 0/.05)` · `shadow-sm` `0 1px 3px rgb(0 0 0/.1), 0 1px 2px -1px rgb(0 0 0/.1)` · `shadow-md` `0 4px 6px -1px rgb(0 0 0/.1), 0 2px 4px -2px rgb(0 0 0/.1)` · `shadow-lg` `0 10px 15px -3px rgb(0 0 0/.1), 0 4px 6px -4px rgb(0 0 0/.1)`.

## Conventions every component shares

| Concern | shadcn base-nova |
|---|---|
| Control height | `h-8` 32px default · `h-7` 28px sm · `h-6` 24px xs · `h-9` 36px lg |
| Control shape | `rounded-lg` (10px), `border` 1px, `px-2.5` (10px), `text-sm` |
| Icons | `size-4` (16px) in controls, `size-3.5` in sm, `size-3` in xs/badges; `pointer-events-none shrink-0` |
| Focus | `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` — border turns `ring`, plus a 3px ring at 50% |
| Invalid | `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20`; dark: border `/50`, ring `/40` |
| Disabled | `disabled:pointer-events-none disabled:opacity-50` (+ `cursor-not-allowed`; inputs also `bg-input/50`, dark `/80`) |
| Pressed | buttons `active:translate-y-px` (not on `aria-haspopup`) |
| Dark fills | controls get `dark:bg-input/30`, hover `dark:bg-input/50` |
| Surfaces | cards `rounded-xl bg-card ring-1 ring-foreground/10` (a ring, not a border), padding `p-4` (sm `p-3`) |
| Floating (popover, menu, select) | `rounded-lg bg-popover p-1 shadow-md ring-1 ring-foreground/10`; items `rounded-md px-1.5 py-1 text-sm`, focus `bg-accent` |
| Overlay (dialog, sheet) | `bg-black/10` + `backdrop-blur-xs`; dialog `rounded-xl p-4 max-w-sm gap-4`, footer `bg-muted/50 border-t` |
| Tooltip | `rounded-md bg-foreground text-background px-3 py-1.5 text-xs` |
| Descriptions | `text-sm text-muted-foreground` |
| Structure | every part has a `data-slot="…"`; states are `data-*` / `aria-*` attributes, never extra classes |

## How ParseUI maps this

ParseUI styles **native HTML** inside `<parse-ui>` — no custom tags. So shadcn's React parts become elements and attributes:

| shadcn | ParseUI |
|---|---|
| `<Button variant size>` | `<button view size>` |
| `<Field>` / `FieldLabel` / `FieldDescription` | `<div field>` / `<label>` / `<small>` |
| `<FieldGroup>` | `<div field-group>` |
| `<ButtonGroup>` | `<div group>` (buttons and inputs) |
| `data-invalid` on Field | automatic — `:has(> [aria-invalid="true"])` |
| `aria-invalid`, `disabled`, `required` | the same native attributes |
| lucide-react icons | `<i icon="name">` / `@parseui/icons` (Lucide names) |

Tokens are `--p-*` custom properties on `:host`, defined as typed data in `packages/parseui/src/tokens/tokens.ts` (light, dark, derived). Themes (`registerTheme`, `core/themes.ts`) override base tokens per mode; light/dark is the `mode` attribute. Components set private `--_*` variables and share state rules (see `button.css.ts`).

### Where ParseUI intentionally differs (product decisions)

- **Default `<button>`** (no `view`) = shadcn's **outline** button (white, thin `border`), not shadcn's filled default.
- **`view` variants** are ParseUI's own palette (primary `#2488ff`, secondary, gray, light, dark, soft, ghost, success = GitHub green `#1f883d`, warning, info, danger, link) at 36px / `rounded-md`-ish 8px, with soft drop shadows, hover lift, and a 0.97 press scale.
- Icons render at a 1.8px stroke (Lucide's is 2px).
- The page palette tokens (`--p-color-bg` `#fff`, `--p-color-text` `#14141b`, …) predate this decision. New components should use shadcn's neutral values; before building card/popover/dialog/menu components, add shadcn-equivalent tokens (`card`, `popover`, `muted`, `muted-foreground`, `accent`, `border`, `input`, `ring`, `destructive`) to `tokens.ts` rather than reusing the page palette.

## Building a component, step by step

1. Read its shadcn source (`shadcn-base-nova.md` or the registry JSON) and open its docs page.
2. Map each `data-slot` part to a native element or an attribute; keep states on native attributes (`aria-*`, `disabled`, `open`, `checked`).
3. Translate classes with the scales above; measure the live docs page to confirm (height, padding, radius, colors in light and dark).
4. Cover every shared convention: focus, invalid, disabled, dark fills, icon sizes.
5. Reproduce shadcn's docs examples on the ParseUI docs page (first example = `default`).
