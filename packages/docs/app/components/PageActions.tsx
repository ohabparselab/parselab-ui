import { useState } from "react";
import { useLocation, useParams } from "@remix-run/react";
import { copyText } from "~/lib/copy";

/**
 * "Copy page" (as Markdown, for AI agents) and a link to the page's
 * Markdown — /llms/<page>.md. The Markdown is the current docs version.
 */
export function PageActions() {
  const { version } = useParams();
  const { pathname } = useLocation();
  const prefix = version ? `/docs/${version}` : "/docs";
  const href = `/llms${pathname.slice(prefix.length) || "/introduction"}.md`;
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error(String(response.status));
      setState((await copyText(await response.text())) ? "copied" : "failed");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 1500);
  }

  return (
    <div className="page-actions">
      <button type="button" className="page-action" onClick={copy}>
        {state === "copied" ? "Copied" : state === "failed" ? "Couldn't copy" : "Copy page"}
      </button>
      <a className="page-action" href={href} target="_blank" rel="noreferrer">
        Markdown
      </a>
    </div>
  );
}
