import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { renderMarkdownFile } from "~/lib/markdown.server";
import { docPath, isValidVersion } from "~/lib/versions.server";
import { DocPage } from "~/components/DocPage";

export const meta = () => [{ title: "Setup — @parselabllc/ui docs" }];

export async function loader({ params }: LoaderFunctionArgs) {
  const version = params.version!;
  if (!(await isValidVersion(version))) {
    throw new Response("Not Found", { status: 404 });
  }

  const { html, headings } = await renderMarkdownFile(docPath(version, "setup.md"));
  return json({ html, headings });
}

export default function DocsIndex() {
  const { html, headings } = useLoaderData<typeof loader>();
  return <DocPage html={html} headings={headings} />;
}
