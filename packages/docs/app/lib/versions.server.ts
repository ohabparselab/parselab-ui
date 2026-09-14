import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { NEXT_VERSION } from "./version-constants";

export { NEXT_VERSION };

const VERSIONS_DIR = fileURLToPath(new URL("../../../../docs/versions", import.meta.url));
const ROOT_DOCS_DIR = fileURLToPath(new URL("../../../../docs", import.meta.url));

function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** Released doc versions, newest first — one per snapshot under `docs/versions/`. */
export async function listVersions(): Promise<string[]> {
  try {
    const entries = await readdir(VERSIONS_DIR, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort((a, b) => compareVersions(b, a));
  } catch {
    return [];
  }
}

/** The version `/docs` (no explicit version segment) redirects to: the newest snapshot, or `next` if none have been cut yet. */
export async function getCurrentVersion(): Promise<string> {
  const [latest] = await listVersions();
  return latest ?? NEXT_VERSION;
}

export async function isValidVersion(version: string): Promise<boolean> {
  if (version === NEXT_VERSION) return true;
  return (await listVersions()).includes(version);
}

/** Resolves a doc's path (e.g. `"setup.md"`, `"admin/button.md"`) against a given version's source directory. */
export function docPath(version: string, relativePath: string): string {
  const base = version === NEXT_VERSION ? ROOT_DOCS_DIR : path.join(VERSIONS_DIR, version);
  return path.join(base, relativePath);
}
