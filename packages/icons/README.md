# @parseui/icons

ParseUI's icon set — a 24px grid and a 1.8px stroke, colored by `currentColor`.

## Install

```bash
npm install @parseui/icons@latest
```

## React

```tsx
import { Search, ChevronRight, Icon } from "@parseui/icons";

<Search />
<ChevronRight size={20} strokeWidth={1.8} />
<Icon name="arrow-right" title="Next" />   // any icon by name; `title` gives it an accessible name
```

Every icon is a named export in PascalCase (`arrow-right` → `ArrowRight`). Props: `size` (default 24), `strokeWidth` (1.8), `color` (`currentColor`), `title`, plus any SVG attribute.

## With parseui

`<i icon="name">` inside `<parse-ui>` loads icons from the CDN by default. Register the set to render them from the bundle instead:

```js
import { registerIcons } from "parseui";
import { icons } from "@parseui/icons";

registerIcons(icons);
```

## Other exports

| Export | |
|---|---|
| `icons` | `{ name: innerSvgMarkup }` for every icon |
| `iconNames` | every icon name |
| `toSvg(name, { size, strokeWidth, title })` | a complete SVG string |
| `@parseui/icons/svg/<name>.svg` | the raw SVG file |
| `@parseui/icons/icons.json` | the `icons` map as JSON |

## CDN

The same SVGs are served from `https://cdn.parseui.com/icons/<version>/<name>.svg` — upload the contents of `dist/svg/` (and `dist/icons.json`) to that path for each release.

## Adding or updating icons (designers)

1. Draw on a 24×24 grid with a 1.8px stroke. Export as SVG with `viewBox="0 0 24 24"`.
2. Save it as `svg/<name>.svg` — kebab-case, e.g. `arrow-right.svg`. The file name is the icon's name everywhere.
3. Run `npm run build --workspace=@parseui/icons`.

The build rewrites the root `<svg>` to the standard one (stroke `currentColor`, round caps and joins), keeps the shapes inside, and rejects files with scripts, event handlers, or a different grid.

> The current set is a placeholder drawn to establish the pipeline — replace the files in `svg/` with the final designs, keeping the names.
