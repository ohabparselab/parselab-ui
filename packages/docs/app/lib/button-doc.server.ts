import { renderMarkdownFile } from "./markdown.server";
import { highlightCode } from "./highlight.server";
import { docPath } from "./versions.server";
import { BUTTON_EXAMPLES } from "~/content/button-examples";

// button.md's rendered HTML is split right before this heading, so the
// Examples gallery can be injected between the intro and "## Usage" —
// matches marked's heading renderer output exactly (see markdown.server.ts).
const SPLIT_MARKER = '<h2 id="usage">';

/** Shared by the versioned and unversioned Button doc routes: the Markdown body (split around "## Usage" so the Examples gallery can render between the intro and it) plus a pre-highlighted Examples gallery, merged into one heading list in the same order they actually appear on the page. */
export async function loadButtonDoc(version: string) {
  const { html, headings: docHeadings } = await renderMarkdownFile(docPath(version, "admin/button.md"));
  const exampleCodeHtml = await Promise.all(BUTTON_EXAMPLES.map((example) => highlightCode(example.code, "html")));

  const splitIndex = html.indexOf(SPLIT_MARKER);
  const introHtml = splitIndex === -1 ? html : html.slice(0, splitIndex);
  const restHtml = splitIndex === -1 ? "" : html.slice(splitIndex);

  const exampleHeadings = [
    { id: "examples", text: "Examples", depth: 2 as const },
    ...BUTTON_EXAMPLES.map((example) => ({ id: example.id, text: example.title, depth: 3 as const })),
  ];

  return {
    html: { intro: introHtml, rest: restHtml },
    headings: [...exampleHeadings, ...docHeadings],
    exampleCodeHtml,
  };
}
