# @parseui/icons

ParseUI's icon set — 1,800+ icons on a 24px grid with a 1.8px stroke, colored by `currentColor`. It starts from [Lucide](https://lucide.dev) (same names as `lucide-react`); ParseUI's designers redraw icons over time, keeping the names.

## Install

```bash
npm install @parseui/icons@latest
```

## React

```tsx
import { Search, ChevronRight, Icon } from "@parseui/icons";

<Search />
<ChevronRight size={20} strokeWidth={1.8} color="#2488ff" />
<Icon name="arrow-right" title="Next" />   // any icon by name; `title` gives it an accessible name
```

Every icon is a named export in PascalCase (`arrow-right` → `ArrowRight`), exactly like lucide-react — including Lucide's old names (`AlertCircle` = `CircleAlert`). Props: `size` (default 24), `strokeWidth` (1.8), `color` (`currentColor`), `title`, plus any SVG attribute.

Tree-shakable: importing a few icons bundles only those (`import { Plus } from "@parseui/icons"` is under 1 KB).

## With parseui

`<i icon="name">` inside `<parse-ui>` loads each icon from the CDN the first time it's used. To render them from your bundle instead (the whole set — about 380 KB), register it:

```js
import { registerIcons } from "parseui";
import { icons } from "@parseui/icons";

registerIcons(icons);
```

## Other exports

| Export | |
|---|---|
| `icons` | `{ name: innerSvgMarkup }` for every icon and old name |
| `iconNames` | every icon name (no old names) |
| `aliases` | `{ oldName: currentName }` |
| `toSvg(name, { size, strokeWidth, title })` | a complete SVG string |
| `@parseui/icons/svg/<name>.svg` | the raw SVG file |
| `@parseui/icons/icons.json` | the `icons` map as JSON |
| `@parseui/icons/tags.json` | `{ name: [search words] }` |

## CDN

The same SVGs (old names included) are served from `https://cdn.parseui.com/icons/<version>/<name>.svg` — `npm run release` uploads `dist/svg/` and `dist/icons.json` there.

## Source files

| File | |
|---|---|
| `svg/<name>.svg` | one file per icon — **the file name is the icon's name everywhere** |
| `aliases.json` | old name → current name |
| `tags.json` | search words per icon (used by the docs) |
| `LICENSE-lucide` | Lucide's license (ISC, and MIT for icons derived from Feather) |

### Redrawing an icon (designers)

1. Draw on a 24×24 grid with a 1.8px stroke. Export as SVG with `viewBox="0 0 24 24"`.
2. Overwrite `svg/<name>.svg` with the same name (or add a new kebab-case name).
3. `npm run build --workspace=@parseui/icons`

The build rewrites the root `<svg>` to the standard one (stroke `currentColor`, round caps and joins), keeps the shapes inside, and rejects files with scripts, event handlers, or a different grid. Old names follow automatically — `aliases.json` points them at the redrawn file.

### Pulling new icons from Lucide

```bash
cd /tmp && npm pack lucide-static && tar xzf lucide-static-*.tgz
npm run import:lucide --workspace=@parseui/icons -- /tmp/package --only-new
```

`--only-new` adds icons we don't have and **never overwrites** a file in `svg/`, so redrawn icons are safe. Without it, every Lucide icon is overwritten.

## License

Build code: MIT. Icons: ISC (Lucide) — see `LICENSE-lucide`, which must stay in the package.
