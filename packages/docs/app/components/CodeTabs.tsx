import { useState } from "react";
import type { HighlightedCode } from "~/lib/pages.server";
import { CopyButton } from "./CopyButton";

/** A code block with one tab per variant (e.g. CDN (JS) / npm). Each block switches on its own. */
export function CodeTabs({ items, embedded = false }: { items: HighlightedCode[]; embedded?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex] ?? items[0];

  return (
    <div className={embedded ? "code-tabs embedded" : "code-tabs"}>
      <div className="code-tabs-header">
        <div className="code-tabs-list" role="tablist">
          {items.map((item, index) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? "active" : undefined}
              onClick={() => setActiveIndex(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <CopyButton text={active.code} />
      </div>
      <div className="code-tabs-body" dangerouslySetInnerHTML={{ __html: active.html }} />
    </div>
  );
}
