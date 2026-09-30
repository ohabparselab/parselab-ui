import type {} from "parseui/jsx";
import { useEffect, useRef, useState } from "react";
import type { HighlightedCode } from "~/lib/pages.server";
import { useSiteTheme } from "~/lib/use-site-theme";
import { CodeTabs } from "./CodeTabs";

// Layout for the preview only (page CSS can't reach inside <parse-ui>, so it
// has to live in there too). Never part of the code users copy.
const PREVIEW_STYLE = `<style>
  .docs-preview { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.5rem; }
  .docs-preview > :is([field], [field-group], form, input, select, textarea) { width: 100%; max-width: 20rem; }
</style>`;

function PreviewSurface({ markup, theme }: { markup: string; theme: "light" | "dark" }) {
  const ref = useRef<HTMLElement>(null);

  // Children are set imperatively, never by React: <parse-ui> moves them into
  // its shadow root, so React never has to reconcile or hydrate them.
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = `${PREVIEW_STYLE}<div class="docs-preview">${markup}</div>`;
  }, [markup]);

  return (
    <div className={`preview-surface ${theme}`}>
      <parse-ui ref={ref} mode={theme} />
    </div>
  );
}

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M8 1v1.3M8 13.7V15M15 8h-1.3M2.3 8H1M12.7 3.3l-.9.9M4.2 11.8l-.9.9M12.7 12.7l-.9-.9M4.2 4.2l-.9-.9"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

/** A live preview (real parseui, in its own theme) with a Code tab showing the CDN and npm versions. */
export function PreviewCard({ markup, code }: { markup: string; code: HighlightedCode[] }) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const siteTheme = useSiteTheme();
  const [themeOverride, setThemeOverride] = useState<"light" | "dark" | null>(null);
  const theme = themeOverride ?? siteTheme;

  return (
    <div className="preview-card">
      <div className="preview-card-header">
        <div className="segmented" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")}>
            Preview
          </button>
          <button type="button" role="tab" aria-selected={tab === "code"} onClick={() => setTab("code")}>
            Code
          </button>
        </div>
        {tab === "preview" && (
          <div className="preview-theme" aria-label="Preview theme">
            <button
              type="button"
              aria-label="Light preview"
              aria-pressed={theme === "light"}
              onClick={() => setThemeOverride("light")}
            >
              <SunIcon />
            </button>
            <button
              type="button"
              aria-label="Dark preview"
              aria-pressed={theme === "dark"}
              onClick={() => setThemeOverride("dark")}
            >
              <MoonIcon />
            </button>
          </div>
        )}
      </div>
      {tab === "preview" ? <PreviewSurface markup={markup} theme={theme} /> : <CodeTabs items={code} embedded />}
    </div>
  );
}
