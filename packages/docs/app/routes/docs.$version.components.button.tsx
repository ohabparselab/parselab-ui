import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { renderMarkdownFile } from "~/lib/markdown.server";
import { docPath, isValidVersion } from "~/lib/versions.server";
import { DocPage } from "~/components/DocPage";
import { Button } from "@parselabllc/ui/react";

export const meta = () => [{ title: "Button — @parselabllc/ui docs" }];

export async function loader({ params }: LoaderFunctionArgs) {
  const version = params.version!;
  if (!(await isValidVersion(version))) {
    throw new Response("Not Found", { status: 404 });
  }

  const { html, headings } = await renderMarkdownFile(docPath(version, "admin/button.md"));
  return json({ html, headings });
}

export default function ButtonDocs() {
  const { html, headings } = useLoaderData<typeof loader>();

  return (
    <DocPage html={html} headings={headings}>
      <div className="live-demo">
        <span className="live-demo-label">Live demo (real &lt;p-button&gt; via @parselabllc/ui/react)</span>
        <Button variant="primary">Save</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="tertiary" tone="critical">
          Delete
        </Button>
        <Button variant="plain" loading>
          Loading
        </Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
      </div>
    </DocPage>
  );
}
