import { llmsFullTxt } from "~/lib/llms.server";

// GET /llms-full.txt — every docs page as Markdown, in one file.
export async function loader() {
  return new Response(await llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
