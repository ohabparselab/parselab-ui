import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import styles from "./styles/docs.css?url";

export const links = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  return (
    // The inline script below sets data-theme on this element before React
    // hydrates; suppressHydrationWarning silences the expected "extra
    // attribute" mismatch instead of papering over a real one.
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>@parselabllc/ui docs</title>
        {/* Runs before paint, before hydration: applies a stored theme
            override immediately so there's no flash of the wrong theme.
            React doesn't manage `data-theme` (it's not in this element's
            JSX props), so this DOM mutation never conflicts with hydration. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
