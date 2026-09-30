/**
 * Builds @parseui/icons from svg/<name>.svg (+ aliases.json, tags.json).
 *
 *   dist/svg/<name>.svg   normalized SVGs, aliases included — uploaded to
 *                         https://cdn.parseui.com/icons/<version>/<name>.svg
 *   dist/icons.json       { name: inner SVG markup }, aliases included
 *   dist/tags.json        { name: [search words] }
 *   dist/runtime.js       shared React/SVG helpers
 *   dist/index.js         ESM: one React component per icon (<Search />),
 *                         alias components (<AlertCircle /> = <CircleAlert />),
 *                         a generic <Icon name>, `icons`, `iconNames`,
 *                         `aliases`, toSvg(). Tree-shakable: each icon's
 *                         markup is its own constant and components are
 *                         /*#__PURE__*\/, so importing one icon bundles one.
 *   dist/index.d.ts       types, including the IconName union
 *
 * Source SVGs must use a 24×24 viewBox. The root <svg> is rewritten to the
 * standard one (stroke = currentColor, 1.8px, round caps/joins), so only the
 * shapes inside come from the file.
 */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const srcDir = path.join(root, "svg");
const distDir = path.join(root, "dist");
const readJson = async (file) => (existsSync(file) ? JSON.parse(await readFile(file, "utf-8")) : {});
const { version } = await readJson(path.join(root, "package.json"));

const ROOT_ATTRS =
  'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

const pascal = (name) => name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const exportName = (name) => (/^[0-9]/.test(pascal(name)) ? `Icon${pascal(name)}` : pascal(name));

function parseIcon(file, source) {
  const name = file.slice(0, -".svg".length);
  const fail = (why) => {
    throw new Error(`svg/${file}: ${why}`);
  };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) fail("file names must be kebab-case, e.g. arrow-right.svg");

  const match = source.trim().match(/^(?:<\?xml[^>]*>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg\b([^>]*)>([\s\S]*)<\/svg>$/);
  if (!match) fail("expected a single <svg> root element");
  const [, attrs, inner] = match;
  if (!/viewBox="0 0 24 24"/.test(attrs)) fail('the icon grid is 24×24 — use viewBox="0 0 24 24"');
  if (/<script|<foreignObject|\son\w+\s*=|javascript:/i.test(inner)) fail("scripts, event handlers and foreignObject aren't allowed");

  const body = inner.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").trim();
  if (!body) fail("the icon is empty");
  return { name, body };
}

// --- read and validate ---
const files = (await readdir(srcDir)).filter((f) => f.endsWith(".svg")).sort();
const set = [];
for (const file of files) set.push(parseIcon(file, await readFile(path.join(srcDir, file), "utf-8")));
const bodyOf = new Map(set.map(({ name, body }) => [name, body]));

const aliases = await readJson(path.join(root, "aliases.json"));
for (const [alias, target] of Object.entries(aliases)) {
  if (bodyOf.has(alias)) throw new Error(`aliases.json: "${alias}" is also svg/${alias}.svg — remove one`);
  if (!bodyOf.has(target)) throw new Error(`aliases.json: "${alias}" points to "${target}", which has no svg/${target}.svg`);
}
const allNames = [...bodyOf.keys(), ...Object.keys(aliases)];

// An alias whose PascalCase equals its own target's (arrow-down-01 → arrow-down-0-1,
// both ArrowDown01) needs no export of its own — it's the same component.
const aliasExports = Object.entries(aliases).filter(([alias, target]) => exportName(alias) !== exportName(target));
const exports = new Map();
for (const name of [...bodyOf.keys(), ...aliasExports.map(([alias]) => alias)]) {
  const id = exportName(name);
  if (exports.has(id)) throw new Error(`${name} and ${exports.get(id)} both export ${id}`);
  if (["Icon", "icons", "iconNames", "aliases", "toSvg", "version"].includes(id)) throw new Error(`${name}: export name ${id} is reserved`);
  exports.set(id, name);
}

const tags = await readJson(path.join(root, "tags.json"));

// --- write ---
await rm(distDir, { recursive: true, force: true });
await mkdir(path.join(distDir, "svg"), { recursive: true });

const iconsMap = Object.fromEntries(allNames.map((name) => [name, bodyOf.get(aliases[name] ?? name)]));
await Promise.all(
  allNames.map((name) => writeFile(path.join(distDir, "svg", `${name}.svg`), `<svg ${ROOT_ATTRS}>${iconsMap[name]}</svg>\n`)),
);
await writeFile(path.join(distDir, "icons.json"), JSON.stringify(iconsMap));
await writeFile(
  path.join(distDir, "tags.json"),
  JSON.stringify(Object.fromEntries([...bodyOf.keys()].filter((name) => tags[name]).map((name) => [name, tags[name]]))),
);

const runtime = `import { createElement, forwardRef } from "react";

const escapeXml = (text) => String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function render(body, { size = 24, strokeWidth = 1.8, color = "currentColor", title, ...props }, ref) {
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

/** A React component for one icon. */
export function createIcon(displayName, body) {
  const component = forwardRef((props, ref) => render(body, props, ref));
  component.displayName = displayName;
  return component;
}

/** <Icon name="…" /> over a name → markup map. */
export function createNamedIcon(icons) {
  const component = forwardRef(function Icon({ name, ...props }, ref) {
    const body = icons[name];
    if (body === undefined) throw new Error(\`@parseui/icons: unknown icon "\${name}"\`);
    return render(body, props, ref);
  });
  component.displayName = "Icon";
  return component;
}

/** An icon as a complete SVG string. */
export function svgString(body, { size = 24, strokeWidth = 1.8, title } = {}) {
  const a11y = title == null ? ' aria-hidden="true"' : ' role="img"';
  const label = title == null ? "" : \`<title>\${escapeXml(title)}</title>\`;
  return \`<svg xmlns="http://www.w3.org/2000/svg" width="\${size}" height="\${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="\${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"\${a11y}>\${label}\${body}</svg>\`;
}
`;
await writeFile(path.join(distDir, "runtime.js"), runtime);

// Each icon's markup is its own constant (i0, i1, …) so unused ones drop out.
const constOf = new Map([...bodyOf.keys()].map((name, index) => [name, `i${index}`]));
const js = [
  `import { createIcon, createNamedIcon, svgString } from "./runtime.js";`,
  ``,
  `export const version = ${JSON.stringify(version)};`,
  ``,
  ...[...bodyOf].map(([name, body]) => `const ${constOf.get(name)} = ${JSON.stringify(body)};`),
  ``,
  ...[...bodyOf.keys()].map((name) => `export const ${exportName(name)} = /*#__PURE__*/ createIcon(${JSON.stringify(exportName(name))}, ${constOf.get(name)});`),
  ``,
  `// Old names (Lucide renames) → the current component.`,
  ...aliasExports.map(([alias, target]) => `export const ${exportName(alias)} = ${exportName(target)};`),
  ``,
  `/** Inner SVG markup of every icon (aliases included), by name. Pass to parseui's registerIcons() to render <i icon> without CDN requests. */`,
  `export const icons = {`,
  ...allNames.map((name) => `  ${JSON.stringify(name)}: ${constOf.get(aliases[name] ?? name)},`),
  `};`,
  ``,
  `/** Every icon name, without aliases. */`,
  `export const iconNames = ${JSON.stringify([...bodyOf.keys()])};`,
  ``,
  `/** { oldName: currentName } */`,
  `export const aliases = ${JSON.stringify(aliases)};`,
  ``,
  `/** Any icon by name: <Icon name="search" />. */`,
  `export const Icon = /*#__PURE__*/ createNamedIcon(icons);`,
  ``,
  `/** An icon as a complete SVG string. */`,
  `export function toSvg(name, options) {`,
  `  const body = icons[name];`,
  `  if (body === undefined) throw new Error(\`@parseui/icons: unknown icon "\${name}"\`);`,
  `  return svgString(body, options);`,
  `}`,
  ``,
].join("\n");
await writeFile(path.join(distDir, "index.js"), js);

const dts = `import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export type IconName =
${allNames.map((name) => `  | ${JSON.stringify(name)}`).join("\n")};

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
export declare const aliases: Record<string, IconName>;
export declare function toSvg(name: IconName, options?: { size?: number | string; strokeWidth?: number | string; title?: string }): string;
export declare const Icon: ForwardRefExoticComponent<IconProps & { name: IconName } & RefAttributes<SVGSVGElement>>;

${[...exports.keys()].map((id) => `export declare const ${id}: IconComponent;`).join("\n")}
`;
await writeFile(path.join(distDir, "index.d.ts"), dts);

console.log(`@parseui/icons ${version}: ${bodyOf.size} icons + ${Object.keys(aliases).length} aliases → dist/`);
