import { readFile } from "node:fs/promises";
import { Marked } from "marked";
import { highlightCode } from "./highlight.server";
import { slugify } from "./slugify";

export interface Heading {
  id: string;
  text: string;
  depth: number;
}


/** Reads a Markdown file and renders it to HTML, collecting `##`/`###` headings (with slug ids matching the rendered anchors) for a page's table of contents. */
export async function renderMarkdownFile(path: string): Promise<{ html: string; headings: Heading[] }> {
  const markdown = await readFile(path, "utf-8");
  const headings: Heading[] = [];
  const slugCounts = new Map<string, number>();

  const marked = new Marked({
    async: true,
    // Shiki's highlighting is async; marked only awaits `walkTokens`
    // (renderer methods must stay synchronous), so we pre-render each code
    // block here and hand the renderer a plain HTML token to pass through.
    async walkTokens(token) {
      if (token.type === "code") {
        const html = await highlightCode(token.text, token.lang ?? "text");
        Object.assign(token, { type: "html", pre: true, block: true, text: html });
      }
    },
    renderer: {
      // (text, level, raw): the pre-v14 signature this version's `_Renderer`
      // class actually implements — `raw` is already plain text (rendered
      // through marked's textRenderer), perfect for slug generation.
      heading(text, level, raw) {
        const baseSlug = slugify(raw);
        const count = slugCounts.get(baseSlug) ?? 0;
        slugCounts.set(baseSlug, count + 1);
        const id = count ? `${baseSlug}-${count}` : baseSlug;

        if (level === 2 || level === 3) {
          headings.push({ id, text: raw, depth: level });
        }

        return `<h${level} id="${id}">${text}</h${level}>\n`;
      },
    },
  });

  const html = await marked.parse(markdown);
  return { html, headings };
}
