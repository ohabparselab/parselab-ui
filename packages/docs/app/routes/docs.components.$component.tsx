import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { loadComponentCode } from "~/lib/pages.server";
import { COMPONENT_DOCS } from "~/content/components";
import { ComponentPage } from "~/components/ComponentPage";

export async function loader({ params }: LoaderFunctionArgs) {
  const code = await loadComponentCode(params.component!);
  if (!code) throw new Response("Not Found", { status: 404 });
  return json(code);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data ? `${COMPONENT_DOCS[data.slug].title} — ParseUI` : "ParseUI" },
];

export default function ComponentRoute() {
  const code = useLoaderData<typeof loader>();
  return <ComponentPage doc={COMPONENT_DOCS[code.slug]} code={code} versionPrefix="/docs" />;
}
