import { useState } from "react";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData, useLocation, useParams } from "@remix-run/react";
import { NAV } from "~/nav";
import { listVersions } from "~/lib/versions.server";
import { VersionSwitcher } from "~/components/VersionSwitcher";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Search } from "~/components/Search";

export async function loader() {
  return json({ versions: await listVersions() });
}

const Logo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="1" y="1" width="22" height="22" rx="6" fill="var(--accent)" />
    <path d="M8 17V7h4.5a3.25 3.25 0 0 1 0 6.5H8" fill="none" stroke="var(--on-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

export default function DocsLayout() {
  const { versions } = useLoaderData<typeof loader>();
  const { version } = useParams();
  const { pathname } = useLocation();
  // Browsing latest (no :version in the URL) keeps links unversioned too;
  // an explicit version in the URL carries through every nav link.
  const versionPrefix = version ? `/docs/${version}` : "/docs";
  const inComponents = pathname.includes("/components/");
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="docs-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <button
            type="button"
            className="icon-button nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <Link to={`${versionPrefix}/introduction`} className="brand">
            <Logo />
            ParseUI
          </Link>
          <VersionSwitcher versions={versions} />
          <nav className="topbar-nav" aria-label="Primary">
            <Link to={`${versionPrefix}/introduction`} className={inComponents ? undefined : "active"}>
              Docs
            </Link>
            <Link to={`${versionPrefix}/components/button`} className={inComponents ? "active" : undefined}>
              Components
            </Link>
          </nav>
          <div className="topbar-actions">
            <Search version={version} versionPrefix={versionPrefix} />
            <ThemeToggle />
            <a
              className="icon-button"
              href="https://github.com/parselab/parselab-ui"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
            >
              <GitHubIcon />
            </a>
          </div>
        </div>
      </header>

      <div className="docs-body">
        <div className={navOpen ? "sidebar-scrim visible" : "sidebar-scrim"} onClick={() => setNavOpen(false)} />
        <aside className={navOpen ? "sidebar open" : "sidebar"}>
          {NAV.map((section) => (
            <div className="sidebar-section" key={section.title}>
              <span className="sidebar-heading">
                {section.title}
                {section.title === "Components" && <span className="count">{section.items.length}</span>}
              </span>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={`${versionPrefix}${item.path}`}
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
