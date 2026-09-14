import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { loadButtonDoc } from "~/lib/button-doc.server";
import { getCurrentVersion } from "~/lib/versions.server";
import { DocPage } from "~/components/DocPage";
import { Example } from "~/components/Example";
import { BUTTON_EXAMPLES } from "~/content/button-examples";

export const meta = () => [{ title: "Button — @parselabllc/ui docs" }];

// Canonical, always-current URL — see docs.getting-started.tsx.
export async function loader() {
  const version = await getCurrentVersion();
  return json(await loadButtonDoc(version));
}

export default function ButtonDocs() {
  const { html, headings, exampleCodeHtml } = useLoaderData<typeof loader>();

  return (
    <DocPage
      html={html}
      headings={headings}
    >
      <h2 id="examples">Examples</h2>
      {BUTTON_EXAMPLES.map((example, i) => (
        <Example
          key={example.id}
          id={example.id}
          title={example.title}
          description={example.description}
          preview={example.render()}
          codeHtml={exampleCodeHtml[i]}
        />
      ))}
    </DocPage>
  );
}
