import { renderMarkdownFile } from "./markdown.server";
import { highlightRaw } from "./highlight.server";
import { docPath } from "./versions.server";
import { GUIDE_SLUGS } from "~/nav";
import { COMPONENT_DOCS } from "~/content/components";
import { exampleVariants, type CodeVariant } from "~/content/code";
import { iconsPage } from "~/content/icons-page";

/** A getting-started page rendered from docs/<slug>.md, or null if there's no such page. */
export async function loadGuidePage(version: string, slug: string) {
  if (!GUIDE_SLUGS.includes(slug)) return null;
  const { html, headings } = await renderMarkdownFile(docPath(version, `${slug}.md`));
  return { slug, html, headings };
}

export interface HighlightedCode {
  label: string;
  code: string;
  html: string;
}

async function highlight(variants: CodeVariant[]): Promise<HighlightedCode[]> {
  return Promise.all(
    variants.map(async ({ label, lang, code }) => ({ label, code, html: await highlightRaw(code, lang) })),
  );
}

/**
 * Pre-highlighted code for a component page. The page's other content
 * (text, markup for previews) is plain data the client imports directly;
 * only Shiki has to run on the server.
 */
export async function loadComponentCode(slug: string) {
  const doc = COMPONENT_DOCS[slug];
  if (!doc) return null;
  return {
    slug,
    hero: await highlight(exampleVariants(doc.hero)),
    installation: await highlight(doc.installation),
    usage: await highlight(exampleVariants(doc.usage)),
    examples: await Promise.all(doc.examples.map((example) => highlight(exampleVariants(example.markup)))),
  };
}

/** Pre-highlighted code for the Icons page. */
export async function loadIconsCode() {
  return {
    installation: await highlight(iconsPage.installation),
    usage: await highlight(iconsPage.usage),
    customize: await highlight(exampleVariants(iconsPage.customizeMarkup)),
    offline: await highlight(iconsPage.offline),
  };
}
