/**
 * The docs as Markdown for AI agents: one page (/llms/<page>.md), an index
 * (/llms.txt, llmstxt.org format) and everything in one file
 * (/llms-full.txt). Built from the same sources the site renders — guide
 * Markdown, component docs, the icons page — so they can't drift apart.
 */
import { readFile } from "node:fs/promises";
import { iconNames } from "@parseui/icons";
import { COMPONENTS_OVERVIEW, COMPONENT_NAV, FLAT_NAV } from "~/nav";
import { COMPONENT_DOCS } from "~/content/components";
import { componentsOverview } from "~/content/components-overview";
import { iconsPage } from "~/content/icons-page";
import { cdnCode, npmCode, type CodeVariant } from "~/content/code";
import type { ApiTable, ComponentDoc } from "~/content/types";
import { SITE_URL, withSite } from "~/site";
import { docPath, getCurrentVersion } from "./versions.server";

export interface MarkdownPage {
  /** Nav path, e.g. "/components/button". */
  path: string;
  title: string;
  /** One line, for llms.txt. */
  summary: string;
  markdown: string;
}

export const markdownUrl = (path: string) => `${SITE_URL}/llms${path}.md`;

const fence = (lang: string, code: string) => `\`\`\`${lang}\n${code}\n\`\`\``;
const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");

function table(api: ApiTable): string {
  const rows = api.rows.map((row) =>
    row.map((value, index) => (api.codeColumns?.includes(index) && value !== "—" ? `\`${cell(value)}\`` : cell(value))),
  );
  return [
    `| ${api.columns.join(" | ")} |`,
    `| ${api.columns.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function variants(items: CodeVariant[]): string {
  return items.map((item) => `**${item.label}**\n\n${fence(item.lang, item.code)}`).join("\n\n");
}

function componentMarkdown(doc: ComponentDoc): string {
  const [top, ...rest] = doc.examples;
  return [
    `# ${doc.title}`,
    `> ${doc.description}`,
    `Markup below goes inside \`<parse-ui>\` (load ParseUI once per page — see ${markdownUrl("/installation")}).`,
    `## ${top.title}`,
    top.description,
    fence("html", top.markup),
    `## Usage`,
    `Every supported way to use ${doc.title.toLowerCase()}. Anything not shown here isn't supported.`,
    `### HTML (CDN)`,
    fence("html", cdnCode(doc.usage)),
    `### React (npm)`,
    fence("tsx", npmCode(doc.usage)),
    `## Examples`,
    ...rest.flatMap((example) => [`### ${example.title}`, example.description, fence("html", example.markup)]),
    `## API reference`,
    ...doc.api.flatMap((api) => [`### ${api.title}`, ...(api.description ? [api.description] : []), table(api)]),
    `## Accessibility`,
    doc.accessibility.map((item) => `- ${item}`).join("\n"),
    `## Keyboard`,
    table({ title: "", columns: ["Key", "Action"], rows: doc.keyboard, codeColumns: [] }),
  ].join("\n\n");
}

function iconsMarkdown(): string {
  return [
    `# ${iconsPage.title}`,
    `> ${iconsPage.description}`,
    `## Installation`,
    variants(iconsPage.installation),
    `## Usage`,
    variants(iconsPage.usage),
    `## Size and color`,
    fence("html", iconsPage.customizeMarkup),
    `## Attributes`,
    table({ title: "", columns: ["Attribute", "Values", "Default", "Description"], rows: iconsPage.attributes, codeColumns: [0, 1, 2] }),
    `## Without the CDN`,
    variants(iconsPage.offline),
    `## Icon names`,
    `${iconNames.length} icons. Use the name in \`<i icon="…">\`; in React, the PascalCase name is the component (\`arrow-right\` → \`<ArrowRight />\`).`,
    iconNames.join(", "),
  ].join("\n\n");
}

function overviewMarkdown(): string {
  return [
    `# ${componentsOverview.title}`,
    `> ${componentsOverview.description}`,
    COMPONENT_NAV.map((item) => `- [${item.title}](${markdownUrl(item.path)}): ${COMPONENT_DOCS[item.path.split("/").pop()!]?.description ?? ""}`).join("\n"),
  ].join("\n\n");
}

/** The first paragraph after the heading, as a one-line summary. */
const firstParagraph = (markdown: string) =>
  markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#") && !block.startsWith("<!--")) ?? "";

async function guideMarkdown(path: string): Promise<string> {
  return withSite(await readFile(docPath(await getCurrentVersion(), `${path.slice(1)}.md`), "utf-8"));
}

/** Every docs page as Markdown, in nav order. */
export async function allPages(): Promise<MarkdownPage[]> {
  return Promise.all(
    FLAT_NAV.map(async ({ path, title }): Promise<MarkdownPage> => {
      if (path === "/icons") return { path, title, summary: iconsPage.description, markdown: iconsMarkdown() };
      if (path === COMPONENTS_OVERVIEW) {
        return { path, title: componentsOverview.title, summary: componentsOverview.description, markdown: overviewMarkdown() };
      }
      const doc = path.startsWith(`${COMPONENTS_OVERVIEW}/`) ? COMPONENT_DOCS[path.split("/").pop()!] : undefined;
      if (doc) return { path, title: doc.title, summary: doc.description, markdown: componentMarkdown(doc) };
      const markdown = await guideMarkdown(path);
      return { path, title, summary: firstParagraph(markdown), markdown };
    }),
  );
}

export async function pageMarkdown(path: string): Promise<MarkdownPage | undefined> {
  return (await allPages()).find((page) => page.path === path);
}

/** The agent rules block from docs/ai.md (between the agent-rules markers), without its code fence. */
async function agentRules(): Promise<string> {
  const ai = await guideMarkdown("/ai");
  const block = ai.match(/<!-- agent-rules:start -->([\s\S]*?)<!-- agent-rules:end -->/)?.[1] ?? "";
  return block.trim().replace(/^```\w*\n/, "").replace(/\n```$/, "").replace(/^## UI: ParseUI\n+/, "");
}

const INTRO =
  "> ParseUI is a drop-in UI kit: wrap plain HTML in `<parse-ui>` and it renders with ParseUI's design (shadcn/ui-style) in a shadow root. One CDN script or `npm install parseui`; no custom tags, no build step required.";

export async function llmsTxt(): Promise<string> {
  const pages = await allPages();
  const sections = new Map<string, MarkdownPage[]>();
  for (const page of pages) {
    const section = FLAT_NAV.find((item) => item.path === page.path)?.section ?? "Docs";
    sections.set(section, [...(sections.get(section) ?? []), page]);
  }
  return [
    `# ParseUI`,
    INTRO,
    `## How to write ParseUI\n\n${await agentRules()}`,
    ...[...sections].map(
      ([section, list]) => `## ${section}\n\n${list.map((page) => `- [${page.title}](${markdownUrl(page.path)}): ${page.summary.replace(/\s+/g, " ")}`).join("\n")}`,
    ),
    `## Optional\n\n- [Full documentation](${SITE_URL}/llms-full.txt): every page above in one file`,
  ].join("\n\n") + "\n";
}

export async function llmsFullTxt(): Promise<string> {
  const pages = await allPages();
  return [`# ParseUI — full documentation`, INTRO, `## How to write ParseUI\n\n${await agentRules()}`, ...pages.map((page) => page.markdown)].join(
    "\n\n---\n\n",
  ) + "\n";
}
