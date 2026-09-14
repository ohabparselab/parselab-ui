import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { renderMarkdownFile } from "~/lib/markdown.server";
import { docPath, getCurrentVersion } from "~/lib/versions.server";
import { DocPage } from "~/components/DocPage";

export const meta = () => [{ title: "Getting started — @parselabllc/ui docs" }];

// The canonical, always-current URL — no version segment. Always resolves
// to whatever the latest released version is (or "next" if none has been
// cut yet), same content `docs.$version.getting-started.tsx` serves for
// that same version, just reached without pinning to it in the URL.
export async function loader() {
  const version = await getCurrentVersion();
  const { html, headings } = await renderMarkdownFile(docPath(version, "setup.md"));
  return json({ html, headings });
}

export default function GettingStarted() {
  const { html, headings } = useLoaderData<typeof loader>();
  return <DocPage html={html} headings={headings} />;
}
