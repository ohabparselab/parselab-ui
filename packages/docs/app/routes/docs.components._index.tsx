import type { MetaFunction } from "@remix-run/node";
import { ComponentsOverview } from "~/components/ComponentsOverview";

export const meta: MetaFunction = () => [{ title: "Components — ParseUI" }];

export default function ComponentsRoute() {
  return <ComponentsOverview versionPrefix="/docs" />;
}
