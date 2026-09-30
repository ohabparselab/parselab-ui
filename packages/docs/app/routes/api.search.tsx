import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { buildSearchIndex } from "~/lib/search.server";
import { getCurrentVersion, isValidVersion } from "~/lib/versions.server";

// GET /api/search?version=<version> — the search index for one docs version
// (latest when omitted). Fetched by the search dialog the first time it
// opens; the dialog keeps it for the rest of the session.
export async function loader({ request }: LoaderFunctionArgs) {
  const requested = new URL(request.url).searchParams.get("version");
  const version = requested && (await isValidVersion(requested)) ? requested : await getCurrentVersion();
  return json(await buildSearchIndex(version));
}
