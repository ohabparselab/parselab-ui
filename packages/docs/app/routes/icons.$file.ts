import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import type { LoaderFunctionArgs } from "@remix-run/node";

// GET /icons/<name>.svg — this repo's built icons (packages/icons/dist/svg),
// which the docs load in place of cdn.parseui.com/icons. See lib/parseui.client.ts.
const svgDir = path.join(path.dirname(createRequire(import.meta.url).resolve("@parseui/icons/package.json")), "dist/svg");

export async function loader({ params }: LoaderFunctionArgs) {
  const file = params.file ?? "";
  // Names only — never a path.
  if (!/^[a-z0-9]+(-[a-z0-9]+)*\.svg$/.test(file)) throw new Response("Not Found", { status: 404 });
  try {
    return new Response(await readFile(path.join(svgDir, file), "utf-8"), {
      headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "no-cache" },
    });
  } catch {
    throw new Response("Not Found", { status: 404 });
  }
}
