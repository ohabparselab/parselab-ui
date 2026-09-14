import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem("theme");
  return stored === "light" || stored === "dark" ? stored : null;
}

export function ThemeToggle() {
  // Starts null so the server-rendered markup and the client's first
  // render pass match exactly (localStorage/matchMedia don't exist on the
  // server) — the real icon appears a beat after mount instead of risking
  // a hydration mismatch.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(getStoredTheme() ?? getSystemTheme());

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      // Only follow the OS once the user hasn't overridden it themselves.
      if (!getStoredTheme()) setTheme(getSystemTheme());
    };
    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      disabled={theme === null}
    >
      {theme === "dark" ? <SunIcon /> : theme === "light" ? <MoonIcon /> : null}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8 1v1.3M8 13.7V15M15 8h-1.3M2.3 8H1M12.7 3.3l-.9.9M4.2 11.8l-.9.9M12.7 12.7l-.9-.9M4.2 4.2l-.9-.9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
