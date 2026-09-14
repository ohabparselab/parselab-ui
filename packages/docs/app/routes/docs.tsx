import { useState } from "react";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { NAV } from "~/nav";
import { NEXT_VERSION } from "~/lib/version-constants";
import { listVersions } from "~/lib/versions.server";
import { VersionSwitcher } from "~/components/VersionSwitcher";
import { ThemeToggle } from "~/components/ThemeToggle";

export async function loader() {
  return json({ versions: await listVersions() });
}

export default function DocsLayout() {
  const { versions } = useLoaderData<typeof loader>();
  const { version } = useParams();
  const currentVersion = version ?? NEXT_VERSION;
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="docs-shell">
      <header className="topbar">
        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <NavLink to={`/docs/${currentVersion}`} className="brand">
          @parselabllc/ui
        </NavLink>
        <VersionSwitcher versions={versions} />
        <ThemeToggle />
        <a className="topbar-link" href="https://github.com/parselab/parselab-ui" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </header>

      <div className="docs-body">
        <div className={navOpen ? "sidebar-scrim visible" : "sidebar-scrim"} onClick={() => setNavOpen(false)} />
        <aside className={navOpen ? "sidebar open" : "sidebar"}>
          {NAV.map((section) => (
            <div className="sidebar-section" key={section.title}>
              <span className="sidebar-heading">{section.title}</span>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={`/docs/${currentVersion}${item.path}`}
                  end
                  onClick={() => setNavOpen(false)}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                >
                  {item.title}
                </NavLink>
              ))}
            </div>
          ))}
        </aside>

        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
