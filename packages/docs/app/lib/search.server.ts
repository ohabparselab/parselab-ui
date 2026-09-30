import { readFile } from "node:fs/promises";
import { marked, type Token } from "marked";
import { COMPONENTS_OVERVIEW, COMPONENT_NAV, NAV } from "~/nav";
import { componentsOverview } from "~/content/components-overview";
import { COMPONENT_DOCS } from "~/content/components";
import { iconsPage } from "~/content/icons-page";
import { iconNames } from "@parseui/icons";
import { docPath } from "./versions.server";
import { slugify } from "./slugify";
import type { SearchEntry } from "./search";

/** Markdown → searchable plain text: drops link targets and formatting marks, keeps code (people search for `npm install`). */
function plain(markdown: string): string {
  return markdown
    .replace(/```\w*/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // Block markers only at line start, so `<button>` and `#16a34a` survive.
    .replace(/^\s*(#{1,6}|>|[-*+]|\d+\.)\s+/gm, " ")
    .replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, " ")
    .replace(/\*\*|[`|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** One entry for the page itself, plus one per `##`/`###` section of a docs/<slug>.md guide. */
async function guideEntries(version: string, section: string, title: string, path: string): Promise<SearchEntry[]> {
  const markdown = await readFile(docPath(version, `${path.slice(1)}.md`), "utf-8");
  const entries: SearchEntry[] = [{ page: title, section, path, text: "" }];
  // Same duplicate numbering as the renderer (it counts every heading level).
  const slugCounts = new Map<string, number>();
  let current = entries[0];

  for (const token of marked.lexer(markdown) as Token[]) {
    if (token.type === "heading") {
      const text = plain(token.text);
      const base = slugify(text);
      const count = slugCounts.get(base) ?? 0;
      slugCounts.set(base, count + 1);
      if (token.depth === 2 || token.depth === 3) {
        current = { page: title, section, heading: text, path: `${path}#${count ? `${base}-${count}` : base}`, text: "" };
        entries.push(current);
      }
    } else if (token.type !== "space") {
      current.text += ` ${plain(token.raw)}`;
    }
  }
  for (const entry of entries) entry.text = entry.text.trim();
  return entries;
}

/** A component page: its description, each example, API table, and the a11y/keyboard notes. */
function componentEntries(section: string, slug: string, path: string): SearchEntry[] {
  const doc = COMPONENT_DOCS[slug];
  if (!doc) return [];
  const at = (anchor: string) => `${path}#${anchor}`;
  // Example markup is searchable (attribute names like `icon-only`), minus inline SVG noise.
  const markupText = (markup: string) => markup.replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/\s+/g, " ");

  return [
    { page: doc.title, section, path, text: plain(doc.description) },
    ...doc.examples.map((example) => ({
      page: doc.title,
      section,
      heading: example.title,
      path: at(example.id),
      text: `${plain(example.description)} ${markupText(example.markup)}`.trim(),
    })),
    ...doc.api.map((table) => ({
      page: doc.title,
      section,
      heading: table.title,
      path: at(slugify(table.title)),
      text: plain(`${table.description ?? ""} ${table.rows.map((row) => row.join(" ")).join(" ")}`),
    })),
    { page: doc.title, section, heading: "Accessibility", path: at("accessibility"), text: plain(doc.accessibility.join(" ")) },
    {
      page: doc.title,
      section,
      heading: "Keyboard",
      path: at("keyboard"),
      text: doc.keyboard.map((row) => row.join(" ")).join(" "),
    },
  ];
}

/** The Icons page: its sections, with every icon name searchable under "Icon set". */
function iconEntries(section: string, path: string): SearchEntry[] {
  const at = (anchor: string) => `${path}#${anchor}`;
  const code = (variants: { code: string }[]) => variants.map((v) => v.code).join(" ");
  return [
    { page: iconsPage.title, section, path, text: plain(iconsPage.description) },
    { page: iconsPage.title, section, heading: "Installation", path: at("installation"), text: code(iconsPage.installation) },
    { page: iconsPage.title, section, heading: "Usage", path: at("usage"), text: code(iconsPage.usage) },
    { page: iconsPage.title, section, heading: "Size and color", path: at("size-and-color"), text: iconsPage.customizeMarkup },
    {
      page: iconsPage.title,
      section,
      heading: "Attributes",
      path: at("attributes"),
      text: plain(iconsPage.attributes.map((row) => row.join(" ")).join(" ")),
    },
    { page: iconsPage.title, section, heading: "Without the CDN", path: at("without-the-cdn"), text: code(iconsPage.offline) },
    { page: iconsPage.title, section, heading: "Icon set", path: at("icon-set"), text: iconNames.join(" ") },
  ];
}

/** Every searchable section of the docs for one version, in navigation order. Paths are relative to the version prefix. */
export async function buildSearchIndex(version: string): Promise<SearchEntry[]> {
  const groups = await Promise.all(
    NAV.flatMap((section) =>
      section.items.map((item) => {
        if (item.path.startsWith("/components/")) {
          return componentEntries(section.title, item.path.slice("/components/".length), item.path);
        }
        if (item.path === "/icons") return iconEntries(section.title, item.path);
        if (item.path === COMPONENTS_OVERVIEW) {
          return [
            {
              page: componentsOverview.title,
              section: section.title,
              path: item.path,
              text: `${plain(componentsOverview.description)} ${COMPONENT_NAV.map((c) => c.title).join(" ")}`,
            },
          ];
        }
        return guideEntries(version, section.title, item.title, item.path);
      }),
    ),
  );
  return groups.flat();
}
