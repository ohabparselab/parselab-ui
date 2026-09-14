import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { loadButtonDoc } from "~/lib/button-doc.server";
import { isValidVersion } from "~/lib/versions.server";
import { DocPage } from "~/components/DocPage";
import { Example } from "~/components/Example";
import { BUTTON_EXAMPLES } from "~/content/button-examples";

export const meta = () => [{ title: "Button — @parselabllc/ui docs" }];

export async function loader({ params }: LoaderFunctionArgs) {
  const version = params.version!;
  if (!(await isValidVersion(version))) {
    throw new Response("Not Found", { status: 404 });
  }

  return json(await loadButtonDoc(version));
}

export default function ButtonDocs() {
  const { html, headings, exampleCodeHtml } = useLoaderData<typeof loader>();

  return (
    <DocPage html={html} headings={headings}>
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
