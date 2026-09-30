import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { loadIconsCode } from "~/lib/pages.server";
import { isValidVersion } from "~/lib/versions.server";
import { IconsPage } from "~/components/IconsPage";

export async function loader({ params }: LoaderFunctionArgs) {
  const version = params.version!;
  if (!(await isValidVersion(version))) throw new Response("Not Found", { status: 404 });
  return json({ ...(await loadIconsCode()), version });
}

export const meta: MetaFunction = () => [{ title: "Icons — ParseUI" }];

export default function VersionedIconsRoute() {
  const { version, ...code } = useLoaderData<typeof loader>();
  return <IconsPage code={code} versionPrefix={`/docs/${version}`} />;
}
