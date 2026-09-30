/**
 * Imports Lucide's icons (https://lucide.dev, ISC) as the starting point of
 * the ParseUI set. Our designers redraw them over time — they replace files
 * in svg/, keeping the names.
 *
 *   npm pack lucide-static && tar xzf lucide-static-*.tgz   # anywhere outside the repo
 *   node scripts/import-lucide.mjs <path to the extracted "package" folder> [--only-new]
 *
 *   --only-new   add icons we don't have yet; never overwrite an existing
 *                svg/<name>.svg (use this once designers have redrawn icons)
 *
 * Writes:
 *   svg/<name>.svg   one file per Lucide icon (inner shapes only matter —
 *                    the build rewrites the root <svg>)
 *   aliases.json     { oldName: currentName } for Lucide's renamed icons —
 *                    entries we added by hand are kept
 *   tags.json        { name: [search words] }
 *   LICENSE-lucide   Lucide's license (ISC, plus MIT for Feather-derived icons)
 */
import { copyFile, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const [source, ...flags] = process.argv.slice(2);
if (!source) {
  console.error("Usage: node scripts/import-lucide.mjs <lucide-static package folder> [--only-new]");
  process.exit(1);
}
const onlyNew = flags.includes("--only-new");

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const svgDir = path.join(root, "svg");
const readJson = async (file, fallback) => (existsSync(file) ? JSON.parse(await readFile(file, "utf-8")) : fallback);

const ROOT =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';

/** The shapes inside a Lucide SVG, whitespace-normalized. */
function innerOf(markup) {
  const inner = markup.replace(/<!--[\s\S]*?-->/g, "").match(/<svg\b[^>]*>([\s\S]*)<\/svg>/)?.[1];
  if (inner === undefined) throw new Error("not an <svg>");
  return inner
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("")
    .replace(/\s*\/>/g, "/>");
}

const canonical = Object.keys(await readJson(path.join(source, "icon-nodes.json"), {})).sort();
if (!canonical.length) throw new Error(`${source} doesn't look like the lucide-static package (no icon-nodes.json)`);
const canonicalSet = new Set(canonical);

// Current icons.
const bodies = new Map();
let written = 0;
let kept = 0;
for (const name of canonical) {
  const body = innerOf(await readFile(path.join(source, "icons", `${name}.svg`), "utf-8"));
  bodies.set(name, body);
  const target = path.join(svgDir, `${name}.svg`);
  if (onlyNew && existsSync(target)) {
    kept++;
    continue;
  }
  await writeFile(target, `${ROOT}${body}</svg>\n`);
  written++;
}

// Renamed icons: lucide-static ships an old-name file with the same shapes as the current one.
const byBody = new Map([...bodies].map(([name, body]) => [body, name]));
const aliasesFile = path.join(root, "aliases.json");
const aliases = await readJson(aliasesFile, {});
let unmatched = 0;
for (const file of await readdir(path.join(source, "icons"))) {
  const name = file.replace(/\.svg$/, "");
  if (!file.endsWith(".svg") || canonicalSet.has(name)) continue;
  const target = byBody.get(innerOf(await readFile(path.join(source, "icons", file), "utf-8")));
  if (target) aliases[name] = target;
  else unmatched++;
}
// An old name is now an alias, so a file of ours with that name would shadow it.
let removed = 0;
for (const alias of Object.keys(aliases)) {
  if (canonicalSet.has(alias)) {
    delete aliases[alias];
    continue;
  }
  const file = path.join(svgDir, `${alias}.svg`);
  if (existsSync(file)) {
    await rm(file);
    removed++;
  }
}
await writeFile(aliasesFile, JSON.stringify(Object.fromEntries(Object.entries(aliases).sort()), null, 2) + "\n");

const tags = await readJson(path.join(source, "tags.json"), {});
await writeFile(
  path.join(root, "tags.json"),
  JSON.stringify(Object.fromEntries(canonical.filter((name) => tags[name]).map((name) => [name, tags[name]])), null, 1) + "\n",
);
await copyFile(path.join(source, "LICENSE"), path.join(root, "LICENSE-lucide"));

console.log(
  `Lucide: ${canonical.length} icons (${written} written${onlyNew ? `, ${kept} kept` : ""}), ` +
    `${Object.keys(aliases).length} aliases${unmatched ? ` (${unmatched} old names had no match, skipped)` : ""}` +
    `${removed ? `, removed ${removed} files now covered by aliases` : ""}.`,
);
