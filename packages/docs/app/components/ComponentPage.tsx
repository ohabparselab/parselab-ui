import type { Heading } from "~/lib/markdown.server";
import type { HighlightedCode } from "~/lib/pages.server";
import type { ComponentDoc } from "~/content/types";
import { DocPage } from "./DocPage";
import { PageHeader } from "./PageHeader";
import { PreviewCard } from "./PreviewCard";
import { PrevNext } from "./PrevNext";
import { Inline } from "./Inline";

import { slugify } from "~/lib/slugify";

export interface ComponentCode {
  usage: HighlightedCode[];
  examples: HighlightedCode[][];
}

function headingsFor(doc: ComponentDoc): Heading[] {
  const [top, ...rest] = doc.examples;
  return [
    { id: top.id, text: top.title, depth: 2 },
    { id: "usage", text: "Usage", depth: 2 },
    { id: "examples", text: "Examples", depth: 2 },
    ...rest.map((example) => ({ id: example.id, text: example.title, depth: 3 })),
    { id: "api-reference", text: "API reference", depth: 2 },
    ...doc.api.map((table) => ({ id: slugify(table.title), text: table.title, depth: 3 })),
    { id: "accessibility", text: "Accessibility", depth: 2 },
    { id: "keyboard", text: "Keyboard", depth: 2 },
  ];
}

/**
 * The standard component page, same layout for every component: the first
 * example (the component's default use) right under the header, then the
 * other examples, API, accessibility and keyboard.
 */
export function ComponentPage({
  doc,
  code,
  versionPrefix,
}: {
  doc: ComponentDoc;
  code: ComponentCode;
  versionPrefix: string;
}) {
  const [top, ...rest] = doc.examples;
  return (
    <DocPage headings={headingsFor(doc)}>
      <PageHeader eyebrow="Components" title={doc.title} description={doc.description} badges={doc.badges} />

      <section className="example">
        <h2 id={top.id}>{top.title}</h2>
        <p>
          <Inline text={top.description} />
        </p>
        <PreviewCard markup={top.markup} code={code.examples[0]} />
      </section>

      <h2 id="usage">Usage</h2>
      <p>Every way to use {doc.title.toLowerCase()}, in one place — copy the lines you need.</p>
      <PreviewCard markup={doc.usage} code={code.usage} />

      <h2 id="examples">Examples</h2>
      {rest.map((example, index) => (
        <section key={example.id} className="example">
          <h3 id={example.id}>{example.title}</h3>
          <p>
            <Inline text={example.description} />
          </p>
          <PreviewCard markup={example.markup} code={code.examples[index + 1]} />
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
