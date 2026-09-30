import { version as ICONS_VERSION } from "@parseui/icons";
import { CDN_URL, type CodeVariant } from "./code";

export { ICONS_VERSION };
export const ICON_CDN_BASE = `https://cdn.parseui.com/icons/${ICONS_VERSION}/`;

/** The Icons page's copy and code, as plain data (code is highlighted on the server). */
export const iconsPage = {
  title: "Icons",
  description:
    "`@parseui/icons` is ParseUI's icon set — 1,800+ icons on a 24px grid with a 1.8px stroke, based on Lucide. Use them by name from the CDN, or import React components from npm, the same way as lucide-react. Hover any icon below to copy it.",

  installation: [
    {
      label: "CDN (JS)",
      lang: "html",
      code: `<!-- Icons are built in: each <i icon> loads its SVG from
     ${ICON_CDN_BASE} the first time it's used. -->
<script src="${CDN_URL}"></script>`,
    },
    { label: "npm", lang: "bash", code: "npm install @parseui/icons@latest" },
  ] satisfies CodeVariant[],

  usage: [
    {
      label: "CDN (JS)",
      lang: "html",
      code: `<parse-ui>
  <i icon="search"></i>
  <button view="primary"><i icon="plus"></i> New product</button>
</parse-ui>`,
    },
    {
      label: "npm",
      lang: "tsx",
      code: `import { Search, ChevronRight } from "@parseui/icons";

<Search />
<ChevronRight size={20} strokeWidth={1.8} />`,
    },
  ] satisfies CodeVariant[],

  /** Live example: sizing, stroke and color. */
  customizeMarkup: `<i icon="star"></i>
<i icon="star" size="24"></i>
<i icon="star" size="32" stroke-width="1.2"></i>
<i icon="heart" size="24" style="color: #dc3e42"></i>
<i icon="info" size="24" aria-label="Information"></i>`,

  offline: [
    {
      label: "npm",
      lang: "tsx",
      code: `import { registerIcons } from "parseui";
import { icons } from "@parseui/icons";

// Every <i icon> now renders from the bundle — no CDN requests.
registerIcons(icons);`,
    },
    {
      label: "CDN (JS)",
      lang: "html",
      code: `<script src="${CDN_URL}"></script>
<script>
  // Serve the SVGs yourself: <your-host>/icons/search.svg, …
  ParseUI.setIconBaseUrl("/icons/");
</script>`,
    },
  ] satisfies CodeVariant[],

  attributes: [
    ["icon", "string", "—", "Icon name, e.g. `arrow-right`."],
    ["size", "number | CSS length", "1.25em", "Width and height. Numbers are pixels. 16px inside a button."],
    ["stroke-width", "number", "1.8", "Line weight."],
    ["aria-label", "string", "—", "Names the icon for screen readers. Without it the icon is decorative."],
  ],
};
