import type { MouseEvent, ReactNode } from "react";
import type { Heading } from "~/lib/markdown.server";
import { TableOfContents } from "./TableOfContents";

// Code blocks are rendered server-side (Markdown -> Shiki HTML) and injected
// via dangerouslySetInnerHTML, so the copy button inside them has no React
// handler of its own — catch its click via delegation on a stable ancestor.
function handleContentClick(event: MouseEvent<HTMLElement>) {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(".copy-button");
  if (!button) return;

  const encoded = button.dataset.code ?? "";
  const code = decodeBase64(encoded);

  copyText(code).then((ok) => {
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

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API unavailable or denied (older browser, insecure
    // context, sandboxed iframe) — fall back to the legacy approach.
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(textarea);
    return ok;
  }
}

function decodeBase64(value: string): string {
  return decodeURIComponent(
    atob(value)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(""),
  );
}

export function DocPage({
  html,
  headings,
  children,
}: {
  html: string;
  headings: Heading[];
  children?: ReactNode;
}) {
  return (
    <div className="doc-page">
      <article className="content" onClick={handleContentClick}>
        {children}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      {headings.length > 0 && <TableOfContents headings={headings} />}
    </div>
  );
}
