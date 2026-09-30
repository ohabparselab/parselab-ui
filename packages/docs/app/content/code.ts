/**
 * Every component example is written once, as plain HTML markup. These turn
 * that markup into the two install flavours shown in each example's code
 * tabs, so preview, CDN code and npm code can never drift apart.
 */
import { version } from "parseui";

export const PARSEUI_VERSION: string = version;
export const CDN_URL = `https://cdn.parseui.com/${PARSEUI_VERSION}/parseui.min.js`;

export interface CodeVariant {
  label: string;
  lang: string;
  code: string;
}

const indent = (text: string, spaces: number) =>
  text
    .split("\n")
    .map((line) => (line ? " ".repeat(spaces) + line : line))
    .join("\n");

/** HTML → JSX: presence-only `loading` needs a value in React. */
function toJsx(markup: string): string {
  return markup.replace(/ loading(?=[\s>/])/g, ' loading=""');
}

export function cdnCode(markup: string): string {
  return `<script src="${CDN_URL}"></script>

<parse-ui>
${indent(markup, 2)}
</parse-ui>`;
}

export function npmCode(markup: string): string {
  return `import "parseui";

export function Example() {
  return (
    <parse-ui>
${indent(toJsx(markup), 6)}
    </parse-ui>
  );
}`;
}

/** The standard CDN (JS) / npm tab pair for a piece of markup. */
export function exampleVariants(markup: string): CodeVariant[] {
  return [
    { label: "CDN (JS)", lang: "html", code: cdnCode(markup) },
    { label: "npm", lang: "tsx", code: npmCode(markup) },
  ];
}
