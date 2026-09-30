/**
 * Builds @parseui/icons from the designer-drawn SVGs in svg/<name>.svg.
 *
 *   dist/svg/<name>.svg   normalized SVG files — uploaded to
 *                         https://cdn.parseui.com/icons/<version>/<name>.svg
 *   dist/icons.json       { name: inner SVG markup } — the whole set in one file
 *   dist/index.js         ESM: React components (<Search />), a generic
 *                         <Icon name="search" />, the `icons` map, toSvg()
 *   dist/index.d.ts       types, including the IconName union
 *
 * Source SVGs must use a 24×24 viewBox. The root <svg> is rewritten to the
 * standard one (stroke = currentColor, 1.8px, round caps/joins), so only the
 * shapes inside come from the file.
 */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const srcDir = path.join(root, "svg");
const distDir = path.join(root, "dist");
const { version } = JSON.parse(await readFile(path.join(root, "package.json"), "utf-8"));

const ROOT_ATTRS =
  'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

const pascal = (name) => name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

function parseIcon(file, source) {
  const name = file.slice(0, -".svg".length);
  const fail = (why) => {
    throw new Error(`svg/${file}: ${why}`);
  };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) fail("file names must be kebab-case, e.g. arrow-right.svg");

  const match = source.trim().match(/^(?:<\?xml[^>]*>\s*)?<svg\b([^>]*)>([\s\S]*)<\/svg>$/);
  if (!match) fail("expected a single <svg> root element");
  const [, attrs, inner] = match;
  if (!/viewBox="0 0 24 24"/.test(attrs)) fail('the icon grid is 24×24 — use viewBox="0 0 24 24"');
  if (/<script|<foreignObject|\son\w+\s*=|javascript:/i.test(inner)) fail("scripts, event handlers and foreignObject aren't allowed");

  const body = inner.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").trim();
  if (!body) fail("the icon is empty");
  return { name, body };
}

const files = (await readdir(srcDir)).filter((f) => f.endsWith(".svg")).sort();
const set = [];
for (const file of files) set.push(parseIcon(file, await readFile(path.join(srcDir, file), "utf-8")));

const exportNames = new Map();
for (const { name } of set) {
  const exportName = pascal(name);
  if (exportNames.has(exportName)) throw new Error(`${name} and ${exportNames.get(exportName)} both export ${exportName}`);
  exportNames.set(exportName, name);
}

await rm(distDir, { recursive: true, force: true });
await mkdir(path.join(distDir, "svg"), { recursive: true });

const icons = Object.fromEntries(set.map(({ name, body }) => [name, body]));
await Promise.all(set.map(({ name, body }) => writeFile(path.join(distDir, "svg", `${name}.svg`), `<svg ${ROOT_ATTRS}>${body}</svg>\n`)));
await writeFile(path.join(distDir, "icons.json"), JSON.stringify(icons));

const js = `import { createElement, forwardRef } from "react";

export const version = ${JSON.stringify(version)};

/** Inner SVG markup of every icon, by name. Pass to parseui's registerIcons() to use <i icon> without CDN requests. */
export const icons = ${JSON.stringify(icons, null, 2)};

export const iconNames = Object.keys(icons);

const escapeXml = (text) => String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** An icon as a complete SVG string. */
export function toSvg(name, { size = 24, strokeWidth = 1.8, title } = {}) {
  const body = icons[name];
  if (body === undefined) throw new Error(\`@parseui/icons: unknown icon "\${name}"\`);
  const a11y = title == null ? ' aria-hidden="true"' : ' role="img"';
  const label = title == null ? "" : \`<title>\${escapeXml(title)}</title>\`;
  return \`<svg xmlns="http://www.w3.org/2000/svg" width="\${size}" height="\${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="\${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"\${a11y}>\${label}\${body}</svg>\`;
}

function render(name, { size = 24, strokeWidth = 1.8, color = "currentColor", title, ...props }, ref) {
  const body = icons[name];
  if (body === undefined) throw new Error(\`@parseui/icons: unknown icon "\${name}"\`);
  const labelled = title != null;
  return createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    focusable: "false",
    "aria-hidden": labelled ? undefined : true,
    role: labelled ? "img" : undefined,
    ...props,
    ref,
    dangerouslySetInnerHTML: { __html: (labelled ? \`<title>\${escapeXml(title)}</title>\` : "") + body },
  });
}

/** Any icon by name: <Icon name="search" />. */
export const Icon = forwardRef(function Icon({ name, ...props }, ref) {
  return render(name, props, ref);
});

function create(name, displayName) {
  const component = forwardRef((props, ref) => render(name, props, ref));
  component.displayName = displayName;
  return component;
}

${[...exportNames].map(([exportName, name]) => `export const ${exportName} = create(${JSON.stringify(name)}, ${JSON.stringify(exportName)});`).join("\n")}
`;
await writeFile(path.join(distDir, "index.js"), js);

const dts = `import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export type IconName =
${set.map(({ name }) => `  | ${JSON.stringify(name)}`).join("\n")};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref" | "children" | "dangerouslySetInnerHTML"> {
  /** Width and height. Default 24. */
  size?: number | string;
  /** Default 1.8. */
  strokeWidth?: number | string;
  /** Stroke color. Default currentColor. */
  color?: string;
  /** Accessible name. Without it the icon is decorative (aria-hidden). */
  title?: string;
}

export type IconComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

export declare const version: string;
export declare const icons: Record<IconName, string>;
export declare const iconNames: IconName[];
export declare function toSvg(name: IconName, options?: { size?: number | string; strokeWidth?: number | string; title?: string }): string;
export declare const Icon: ForwardRefExoticComponent<IconProps & { name: IconName } & RefAttributes<SVGSVGElement>>;

${[...exportNames.keys()].map((exportName) => `export declare const ${exportName}: IconComponent;`).join("\n")}
`;
await writeFile(path.join(distDir, "index.d.ts"), dts);

console.log(`@parseui/icons ${version}: ${set.length} icons → dist/`);
