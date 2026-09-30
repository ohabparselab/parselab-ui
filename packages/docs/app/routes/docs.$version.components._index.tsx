import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { isValidVersion } from "~/lib/versions.server";
import { ComponentsOverview } from "~/components/ComponentsOverview";

export async function loader({ params }: LoaderFunctionArgs) {
  const version = params.version!;
  if (!(await isValidVersion(version))) throw new Response("Not Found", { status: 404 });
  return json({ version });
}

export const meta: MetaFunction = () => [{ title: "Components — ParseUI" }];

export default function VersionedComponentsRoute() {
  const { version } = useLoaderData<typeof loader>();
  return <ComponentsOverview versionPrefix={`/docs/${version}`} />;
}
