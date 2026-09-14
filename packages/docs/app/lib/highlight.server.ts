import { codeToHtml } from "shiki";

/**
 * VS Code's own bundled "Dark+"/"Light+" themes (via Shiki, which reuses
 * VS Code's TextMate grammars and theme files directly) — real VS Code
 * highlighting, not a lookalike. `defaultColor: false` + the paired
 * `--shiki-light`/`--shiki-dark` CSS vars (see docs.css) is Shiki's
 * documented pattern for switching themes via `prefers-color-scheme`
 * without a client-side toggle, matching how the rest of this site themes.
 */
export async function highlightCode(code: string, lang: string): Promise<string> {
  const html = await codeToHtml(code, {
    lang: isSupportedLang(lang) ? lang : "text",
    themes: { light: "light-plus", dark: "dark-plus" },
    defaultColor: false,
  });

  const encodedCode = Buffer.from(code, "utf-8").toString("base64");

  return `<div class="code-block" data-lang="${escapeAttr(lang)}">
  <div class="code-block-header">
    <span class="code-block-lang">${escapeAttr(lang || "text")}</span>
    <button type="button" class="copy-button" data-code="${encodedCode}">
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="copy-icon">
        <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor"/>
        <path d="M10.5 5.5V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" stroke="currentColor"/>
      </svg>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="check-icon">
        <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="copy-button-label">Copy</span>
    </button>
  </div>
  ${html}
</div>`;
}

const SUPPORTED_LANGS = new Set([
  "html",
  "tsx",
  "ts",
  "typescript",
  "js",
  "jsx",
  "javascript",
  "bash",
  "sh",
  "shell",
  "css",
  "json",
  "md",
  "markdown",
  "text",
]);

function isSupportedLang(lang: string): boolean {
  return SUPPORTED_LANGS.has(lang);
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
