import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import { Button } from "@parselabllc/ui/react";

// docs/admin/button.md lives at the monorepo root, shared with the
// published package's `homepage` link — read straight from source so this
// page never drifts from the canonical doc.
const DOC_PATH = fileURLToPath(
  new URL("../../../../docs/admin/button.md", import.meta.url),
);

export async function loader() {
  const markdown = await readFile(DOC_PATH, "utf-8");
  return json({ html: marked.parse(markdown) });
}

export default function ButtonDocs() {
  const { html } = useLoaderData<typeof loader>();

  return (
    <>
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
      <div className="content" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
