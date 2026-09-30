import type { HighlightedCode } from "~/lib/pages.server";
import { useInstallMethod } from "~/lib/use-install-method";
import { CopyButton } from "./CopyButton";

export function CodeTabs({ items, embedded = false }: { items: HighlightedCode[]; embedded?: boolean }) {
  const [method, chooseMethod] = useInstallMethod();
  const matched = items.findIndex((item) => item.label === method);
  const activeIndex = matched === -1 ? 0 : matched;
  const active = items[activeIndex];

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
              onClick={() => chooseMethod(item.label)}
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
