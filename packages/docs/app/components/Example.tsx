import type { ReactNode } from "react";

export function Example({
  id,
  title,
  description,
  preview,
  codeHtml,
}: {
  id: string;
  title: string;
  description: string;
  preview: ReactNode;
  /** Pre-highlighted HTML from `highlightCode()` — already a full `.code-block` (header, copy button, Shiki markup). */
  codeHtml: string;
}) {
  return (
    <div className="example">
      <h3 id={id}>{title}</h3>
      <p>{description}</p>
      <div className="example-layout">
        <div className="example-preview">
          <div className="example-preview-header">Preview</div>
          <div className="example-preview-body">{preview}</div>
        </div>
        <div className="example-code" dangerouslySetInnerHTML={{ __html: codeHtml }} />
      </div>
    </div>
  );
}
