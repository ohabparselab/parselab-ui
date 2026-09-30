import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { loadComponentCode } from "~/lib/pages.server";
import { isValidVersion } from "~/lib/versions.server";
import { COMPONENT_DOCS } from "~/content/components";
import { ComponentPage } from "~/components/ComponentPage";

export async function loader({ params }: LoaderFunctionArgs) {
  const version = params.version!;
  const code = (await isValidVersion(version)) ? await loadComponentCode(params.component!) : null;
  if (!code) throw new Response("Not Found", { status: 404 });
  return json({ ...code, version });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data ? `${COMPONENT_DOCS[data.slug].title} — ParseUI` : "ParseUI" },
];

export default function VersionedComponentRoute() {
  const { version, ...code } = useLoaderData<typeof loader>();
  return <ComponentPage doc={COMPONENT_DOCS[code.slug]} code={code} versionPrefix={`/docs/${version}`} />;
}
