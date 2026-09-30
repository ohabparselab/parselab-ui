import type { Heading } from "~/lib/markdown.server";
import type { HighlightedCode } from "~/lib/pages.server";
import type { ComponentDoc } from "~/content/types";
import { DocPage } from "./DocPage";
import { PageHeader } from "./PageHeader";
import { PreviewCard } from "./PreviewCard";
import { CodeTabs } from "./CodeTabs";
import { PrevNext } from "./PrevNext";
import { Inline } from "./Inline";

export interface ComponentCode {
  hero: HighlightedCode[];
  installation: HighlightedCode[];
  usage: HighlightedCode[];
  examples: HighlightedCode[][];
}

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function headingsFor(doc: ComponentDoc): Heading[] {
  return [
    { id: "installation", text: "Installation", depth: 2 },
    { id: "usage", text: "Usage", depth: 2 },
    { id: "examples", text: "Examples", depth: 2 },
    ...doc.examples.map((example) => ({ id: example.id, text: example.title, depth: 3 })),
    { id: "api-reference", text: "API reference", depth: 2 },
    ...doc.api.map((table) => ({ id: slugify(table.title), text: table.title, depth: 3 })),
    { id: "accessibility", text: "Accessibility", depth: 2 },
    { id: "keyboard", text: "Keyboard", depth: 2 },
  ];
}

/** The standard component page: preview, install, usage, examples, API, a11y — same layout for every component. */
export function ComponentPage({
  doc,
  code,
  versionPrefix,
}: {
  doc: ComponentDoc;
  code: ComponentCode;
  versionPrefix: string;
}) {
  return (
    <DocPage headings={headingsFor(doc)}>
      <PageHeader eyebrow="Components" title={doc.title} description={doc.description} badges={doc.badges} />
      <PreviewCard markup={doc.hero} code={code.hero} />

      <h2 id="installation">Installation</h2>
      <p>
        Load ParseUI once per page — with the CDN script, or from npm. See <a href={`${versionPrefix}/installation`}>Installation</a>{" "}
        for details.
      </p>
      <CodeTabs items={code.installation} />

      <h2 id="usage">Usage</h2>
      <CodeTabs items={code.usage} />

      <h2 id="examples">Examples</h2>
      {doc.examples.map((example, index) => (
        <section key={example.id} className="example">
          <h3 id={example.id}>{example.title}</h3>
          <p>
            <Inline text={example.description} />
          </p>
          <PreviewCard markup={example.markup} code={code.examples[index]} />
        </section>
      ))}

      <h2 id="api-reference">API reference</h2>
      {doc.api.map((table) => (
        <section key={table.title}>
          <h3 id={slugify(table.title)}>{table.title}</h3>
          {table.description && (
            <p>
              <Inline text={table.description} />
            </p>
          )}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {table.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td key={index}>{table.codeColumns?.includes(index) && cell !== "—" ? <code>{cell}</code> : cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <h2 id="accessibility">Accessibility</h2>
      <ul>
        {doc.accessibility.map((item) => (
          <li key={item}>
            <Inline text={item} />
          </li>
        ))}
      </ul>

      <h2 id="keyboard">Keyboard</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doc.keyboard.map(([key, action]) => (
              <tr key={key}>
                <td>
                  <kbd>{key}</kbd>
                </td>
                <td>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PrevNext path={`/components/${doc.slug}`} versionPrefix={versionPrefix} />
    </DocPage>
  );
}
