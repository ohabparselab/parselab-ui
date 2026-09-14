#!/usr/bin/env node
/**
 * Cuts a versioned docs snapshot: copies the current (`docs/`) Markdown
 * source into `docs/versions/<version>/`, frozen as of that release, so the
 * docs site's version switcher (`packages/docs`) can keep serving old docs
 * unchanged as `docs/` moves on for the next release.
 *
 * Usage:
 *   node scripts/snapshot-docs.mjs            # uses packages/ui/package.json's version
 *   node scripts/snapshot-docs.mjs 0.2.0       # explicit version
 *   node scripts/snapshot-docs.mjs --force     # overwrite an existing snapshot
 */
import { cp, mkdir, readdir, readFile, rm, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const docsDir = path.join(repoRoot, "docs");
const versionsDir = path.join(docsDir, "versions");

const args = process.argv.slice(2);
const force = args.includes("--force");
const positional = args.find((a) => !a.startsWith("--"));

async function resolveVersion() {
  if (positional) return positional;
  const pkg = JSON.parse(await readFile(path.join(repoRoot, "packages/ui/package.json"), "utf-8"));
  return pkg.version;
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

const version = await resolveVersion();
if (!version) {
  console.error("Could not resolve a version. Pass one explicitly: node scripts/snapshot-docs.mjs 0.2.0");
  process.exit(1);
}

const target = path.join(versionsDir, version);

if (await exists(target)) {
  if (!force) {
    console.error(`docs/versions/${version} already exists. Pass --force to overwrite it.`);
    process.exit(1);
  }
  await rm(target, { recursive: true, force: true });
}

await mkdir(target, { recursive: true });

// Copy each top-level entry individually (skipping "versions" itself) —
// `fs.cp` refuses to copy a directory into its own subdirectory outright,
// even with a filter, since the target lives inside `docs/`.
const entries = await readdir(docsDir, { withFileTypes: true });
for (const entry of entries) {
  if (entry.name === "versions") continue;
  await cp(path.join(docsDir, entry.name), path.join(target, entry.name), { recursive: true });
}

console.log(`Snapshotted docs/ -> docs/versions/${version}`);
