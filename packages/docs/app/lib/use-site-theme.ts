import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/** The docs site's effective theme — the toggle's `data-theme` choice, else the OS setting. */
export function useSiteTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const read = () => {
      const chosen = document.documentElement.getAttribute("data-theme");
      setTheme(chosen === "light" || chosen === "dark" ? chosen : media.matches ? "dark" : "light");
    };
    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    media.addEventListener("change", read);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", read);
    };
  }, []);

  return theme;
}
