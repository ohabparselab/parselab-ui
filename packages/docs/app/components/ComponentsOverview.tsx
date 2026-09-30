import { Link } from "@remix-run/react";
import type { Heading } from "~/lib/markdown.server";
import { COMPONENTS_OVERVIEW, COMPONENT_NAV, type NavItem } from "~/nav";
import { DocPage } from "./DocPage";
import { PageHeader } from "./PageHeader";
import { PrevNext } from "./PrevNext";
import { componentsOverview } from "~/content/components-overview";

function ComponentIndex({ items, versionPrefix }: { items: NavItem[]; versionPrefix: string }) {
  return (
    <ul className="component-index">
      {items.map((item) => (
        <li key={item.path}>
          <Link to={`${versionPrefix}${item.path}`}>
            {item.title}
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** /docs/components — every component, linked. Built from the nav, so new components appear on their own. */
export function ComponentsOverview({ versionPrefix }: { versionPrefix: string }) {
  const fresh = COMPONENT_NAV.filter((item) => item.badge === "New");
  const headings: Heading[] = [
    ...(fresh.length ? [{ id: "new-components", text: "New components", depth: 2 }] : []),
    { id: "all-components", text: "All components", depth: 2 },
  ];

  return (
    <DocPage headings={headings}>
      <PageHeader
        eyebrow="Components"
        title={componentsOverview.title}
        description={componentsOverview.description}
      />

      {fresh.length > 0 && (
        <>
          <h2 id="new-components">New components</h2>
          <ComponentIndex items={fresh} versionPrefix={versionPrefix} />
        </>
      )}

      <h2 id="all-components">All components</h2>
      <ComponentIndex items={COMPONENT_NAV} versionPrefix={versionPrefix} />

      <p className="component-index-note">
        Looking for icons? Browse the <Link to={`${versionPrefix}/icons`}>icon set</Link>.
      </p>

      <PrevNext path={COMPONENTS_OVERVIEW} versionPrefix={versionPrefix} />
    </DocPage>
  );
}
