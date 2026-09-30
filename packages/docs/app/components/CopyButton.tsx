import { useState } from "react";
import { copyText } from "~/lib/copy";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    if (!(await copyText(text))) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button type="button" className={copied ? "copy-button copied" : "copy-button"} onClick={onClick}>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="copy-icon">
        <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" />
        <path d="M10.5 5.5V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" stroke="currentColor" />
      </svg>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="check-icon">
        <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="copy-button-label">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
