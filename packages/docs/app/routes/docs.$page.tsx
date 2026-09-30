import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { loadGuidePage } from "~/lib/pages.server";
import { getCurrentVersion, isValidVersion } from "~/lib/versions.server";
import { GuidePage } from "~/components/GuidePage";
import { FLAT_NAV } from "~/nav";

// Unversioned getting-started pages (/docs/introduction, …), always latest.
// A bare /docs/<version> also lands here and redirects into that version.
export async function loader({ params }: LoaderFunctionArgs) {
  const page = params.page!;
  if (await isValidVersion(page)) return redirect(`/docs/${page}/introduction`);

  const guide = await loadGuidePage(await getCurrentVersion(), page);
  if (!guide) throw new Response("Not Found", { status: 404 });
  return json(guide);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = FLAT_NAV.find((item) => item.path === `/${data?.slug}`)?.title;
  return [{ title: title ? `${title} — ParseUI` : "ParseUI" }];
};

export default function GuideRoute() {
  const { slug, html, headings } = useLoaderData<typeof loader>();
  return <GuidePage slug={slug} html={html} headings={headings} versionPrefix="/docs" />;
}
