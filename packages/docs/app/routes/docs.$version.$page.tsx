import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { loadGuidePage } from "~/lib/pages.server";
import { isValidVersion } from "~/lib/versions.server";
import { GuidePage } from "~/components/GuidePage";
import { FLAT_NAV } from "~/nav";

export async function loader({ params }: LoaderFunctionArgs) {
  const version = params.version!;
  const guide = (await isValidVersion(version)) ? await loadGuidePage(version, params.page!) : null;
  if (!guide) throw new Response("Not Found", { status: 404 });
  return json({ ...guide, version });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = FLAT_NAV.find((item) => item.path === `/${data?.slug}`)?.title;
  return [{ title: title ? `${title} — ParseUI` : "ParseUI" }];
};

export default function VersionedGuideRoute() {
  const { slug, html, headings, version } = useLoaderData<typeof loader>();
  return <GuidePage slug={slug} html={html} headings={headings} versionPrefix={`/docs/${version}`} />;
}
