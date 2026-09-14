import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink,
} from "@remix-run/react";

import styles from "./styles/docs.css?url";

export const links = () => [{ rel: "stylesheet", href: styles }];

const PAGES = [{ title: "Button", to: "/admin/button" }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>@parselabllc/ui docs</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="layout">
          <nav>
            <h1>Docs</h1>
            {PAGES.map((page) => (
              <NavLink
                key={page.to}
                to={page.to}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                {page.title}
              </NavLink>
            ))}
          </nav>
          <main>
            <Outlet />
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
