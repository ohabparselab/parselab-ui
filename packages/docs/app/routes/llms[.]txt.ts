import { llmsTxt } from "~/lib/llms.server";

// GET /llms.txt — index of the docs for AI agents (https://llmstxt.org).
export async function loader() {
  return new Response(await llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
