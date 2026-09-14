import { redirect } from "@remix-run/node";
import { getCurrentVersion } from "~/lib/versions.server";

export async function loader() {
  const version = await getCurrentVersion();
  return redirect(`/docs/${version}`);
}
