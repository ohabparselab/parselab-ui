import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

// GET /parseui.min.js — this repo's CDN build (packages/parseui/dist/cdn),
// which the docs load in place of cdn.parseui.com. See lib/parseui.client.ts.
const packageDir = path.dirname(createRequire(import.meta.url).resolve("parseui/package.json"));
const file = path.join(packageDir, "dist/cdn/parseui.min.js");

export async function loader() {
  try {
    return new Response(await readFile(file, "utf-8"), {
      headers: { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache" },
    });
  } catch {
    return new Response("// parseui isn't built yet: run `npm run build` in the repo root.", {
      status: 404,
      headers: { "Content-Type": "text/javascript; charset=utf-8" },
    });
  }
}
