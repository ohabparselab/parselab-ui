import { renderMarkdownFile } from "./markdown.server";
import { highlightCode } from "./highlight.server";
import { docPath } from "./versions.server";
import { BUTTON_EXAMPLES } from "~/content/button-examples";

/** Shared by the versioned and unversioned Button doc routes: the Markdown body plus a pre-highlighted Examples gallery, merged into one heading list (Examples first, matching where it renders on the page). */
export async function loadButtonDoc(version: string) {
  const { html, headings: docHeadings } = await renderMarkdownFile(docPath(version, "admin/button.md"));
  const exampleCodeHtml = await Promise.all(BUTTON_EXAMPLES.map((example) => highlightCode(example.code, "html")));

  const exampleHeadings = [
    { id: "examples", text: "Examples", depth: 2 as const },
    ...BUTTON_EXAMPLES.map((example) => ({ id: example.id, text: example.title, depth: 3 as const })),
  ];

  return { html, headings: [...docHeadings, ...exampleHeadings], exampleCodeHtml };
}
