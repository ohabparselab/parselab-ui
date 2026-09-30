import type { LoaderFunctionArgs } from "@remix-run/node";
import { pageMarkdown } from "~/lib/llms.server";

// GET /llms/<page>.md — one docs page as Markdown, e.g. /llms/components/button.md.
export async function loader({ params }: LoaderFunctionArgs) {
  const match = (params["*"] ?? "").match(/^([a-z0-9/-]+)\.md$/);
  const page = match ? await pageMarkdown(`/${match[1]}`) : undefined;
  if (!page) throw new Response("Not Found", { status: 404 });
  return new Response(page.markdown + "\n", { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
