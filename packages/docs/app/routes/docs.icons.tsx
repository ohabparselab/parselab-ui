import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { loadIconsCode } from "~/lib/pages.server";
import { IconsPage } from "~/components/IconsPage";

export async function loader() {
  return json(await loadIconsCode());
}

export const meta: MetaFunction = () => [{ title: "Icons — ParseUI" }];

export default function IconsRoute() {
  const code = useLoaderData<typeof loader>();
  return <IconsPage code={code} versionPrefix="/docs" />;
}
