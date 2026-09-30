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

/**
 * HTML → JSX: ParseUI's presence-only attributes need a value in React,
 * `for` is `htmlFor`, and SVG presentation attributes are camelCase.
 */
function toJsx(markup: string): string {
  // Split out HTML comments first, so words inside them ("loading", "field"…)
  // aren't rewritten; comments become JSX comments.
  return markup
    .split(/(<!--[\s\S]*?-->)/)
    .map((part) =>
      part.startsWith("<!--")
        ? `{/* ${part.slice(4, -3).trim()} */}`
        : part
            .replace(/ (loading|icon-only|full-width|outline|group|field|field-group)(?=[\s>/])/g, ' $1=""')
            .replace(/ for="/g, ' htmlFor="')
            .replace(/ stroke-(width|linecap|linejoin)=/g, (_, name: string) => ` stroke${name[0].toUpperCase()}${name.slice(1)}=`),
    )
    .join("");
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
