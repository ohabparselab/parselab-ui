import type { MouseEvent, ReactNode } from "react";
import type { Heading } from "~/lib/markdown.server";
import { copyText } from "~/lib/copy";
import { TableOfContents } from "./TableOfContents";
import { PageActions } from "./PageActions";

// Markdown code blocks are server-rendered HTML (see highlight.server.ts)
// with a `data-code` copy button React doesn't manage — catch its clicks by
// delegation. React-rendered CopyButtons have no data-code, so they're skipped.
function handleContentClick(event: MouseEvent<HTMLElement>) {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(".copy-button[data-code]");
  if (!button) return;

  copyText(decodeBase64(button.dataset.code ?? "")).then((ok) => {
    if (!ok) return;
    button.classList.add("copied");
    const label = button.querySelector(".copy-button-label");
    const previous = label?.textContent;
    if (label) label.textContent = "Copied";
    window.setTimeout(() => {
      button.classList.remove("copied");
      if (label && previous) label.textContent = previous;
    }, 1500);
  });
}

function decodeBase64(value: string): string {
  return decodeURIComponent(
    atob(value)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(""),
  );
}

/** Article column + "On this page" table of contents. */
export function DocPage({ headings, children }: { headings: Heading[]; children: ReactNode }) {
  return (
    <div className="doc-page">
      <article className="content" onClick={handleContentClick}>
        <PageActions />
        {children}
      </article>
      {headings.length > 0 && <TableOfContents headings={headings} />}
    </div>
  );
}
