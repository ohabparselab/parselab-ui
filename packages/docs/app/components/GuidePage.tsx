import type { Heading } from "~/lib/markdown.server";
import { sectionOf } from "~/nav";
import { DocPage } from "./DocPage";
import { PrevNext } from "./PrevNext";

/** A Markdown-backed getting-started page. */
export function GuidePage({
  slug,
  html,
  headings,
  versionPrefix,
}: {
  slug: string;
  html: string;
  headings: Heading[];
  versionPrefix: string;
}) {
  const path = `/${slug}`;
  return (
    <DocPage headings={headings}>
      <p className="eyebrow">{sectionOf(path)}</p>
      <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
      <PrevNext path={path} versionPrefix={versionPrefix} />
    </DocPage>
  );
}
