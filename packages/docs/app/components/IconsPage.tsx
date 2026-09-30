import { useEffect, useMemo, useRef, useState } from "react";
import { aliases, iconNames, toSvg, type IconName } from "@parseui/icons";
import iconTags from "@parseui/icons/tags.json";
import type { Heading } from "~/lib/markdown.server";
import type { HighlightedCode } from "~/lib/pages.server";
import { copyText } from "~/lib/copy";
import { iconsPage } from "~/content/icons-page";
import { DocPage } from "./DocPage";
import { PageHeader } from "./PageHeader";
import { CodeTabs } from "./CodeTabs";
import { PreviewCard } from "./PreviewCard";
import { PrevNext } from "./PrevNext";
import { Inline } from "./Inline";

export interface IconsCode {
  installation: HighlightedCode[];
  usage: HighlightedCode[];
  customize: HighlightedCode[];
  offline: HighlightedCode[];
}

const HEADINGS: Heading[] = [
  { id: "installation", text: "Installation", depth: 2 },
  { id: "usage", text: "Usage", depth: 2 },
  { id: "size-and-color", text: "Size and color", depth: 3 },
  { id: "attributes", text: "Attributes", depth: 3 },
  { id: "without-the-cdn", text: "Without the CDN", depth: 3 },
  { id: "icon-set", text: "Icon set", depth: 2 },
];

const pascal = (name: string) => name.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
// Same rule as the package build: an export can't start with a digit.
const exportName = (name: string) => (/^[0-9]/.test(pascal(name)) ? `Icon${pascal(name)}` : pascal(name));

/** Cards rendered per batch; more load as you scroll (the set has 1,800+). */
const BATCH = 240;

const tags = iconTags as Record<string, string[]>;
// Old names, grouped by the icon they point to — "alert-circle" finds circle-alert.
const oldNames = new Map<string, string[]>();
for (const [alias, target] of Object.entries(aliases)) oldNames.set(target, [...(oldNames.get(target) ?? []), alias]);

/** Icons matching every word, best first: exact name, name prefix, name, old name, then tags. */
function searchIcons(query: string): IconName[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return iconNames;
  const joined = words.join("-");
  const scored: { name: IconName; score: number }[] = [];
  iconNames.forEach((name, index) => {
    const haystack = [name, ...(oldNames.get(name) ?? []), ...(tags[name] ?? [])].join(" ");
    if (!words.every((word) => haystack.includes(word))) return;
    const score =
      name === joined ? 5 : name.startsWith(joined) ? 4 : name.includes(joined) ? 3 : (oldNames.get(name) ?? []).some((a) => a.includes(joined)) ? 2 : 1;
    scored.push({ name, score: score * 10000 - index });
  });
  return scored.sort((a, b) => b.score - a.score).map((entry) => entry.name);
}

type CopyFormat = "HTML" | "SVG" | "JSX";

function snippet(name: IconName, format: CopyFormat): string {
  if (format === "HTML") return `<i icon="${name}"></i>`;
  if (format === "SVG") return toSvg(name);
  return `<${exportName(name)} />`;
}

function IconCard({ name }: { name: IconName }) {
  const [copied, setCopied] = useState<CopyFormat | null>(null);

  async function copy(format: CopyFormat) {
    if (!(await copyText(snippet(name, format)))) return;
    setCopied(format);
    window.setTimeout(() => setCopied((current) => (current === format ? null : current)), 1500);
  }

  return (
    <li className="icon-card">
      <span className="icon-card-glyph" dangerouslySetInnerHTML={{ __html: toSvg(name) }} />
      <span className="icon-card-name">{name}</span>
      <span className="icon-card-actions">
        {(["HTML", "SVG", "JSX"] as const).map((format) => (
          <button
            key={format}
            type="button"
            className={copied === format ? "copied" : undefined}
            aria-label={`Copy ${name} as ${format}`}
            onClick={() => copy(format)}
          >
            {copied === format ? "Copied" : format}
          </button>
        ))}
      </span>
    </li>
  );
}

function IconGrid() {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(BATCH);
  const matches = useMemo(() => searchIcons(query), [query]);
  const more = useRef<HTMLButtonElement>(null);

  useEffect(() => setLimit(BATCH), [query]);

  // Load the next batch when the "Show more" button scrolls into view.
  useEffect(() => {
    const button = more.current;
    if (!button || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => entries.some((entry) => entry.isIntersecting) && setLimit((n) => n + BATCH),
      { rootMargin: "400px" },
    );
    observer.observe(button);
    return () => observer.disconnect();
  }, [matches, limit]);

  return (
    <>
      <div className="icon-toolbar">
        <label className="icon-search">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.4" />
            <path d="m10.5 10.5 3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder={`Search ${iconNames.length} icons — try "delete" or "arrow"`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search icons"
          />
        </label>
        <span className="icon-count" aria-live="polite">
          {matches.length === iconNames.length ? `${iconNames.length} icons` : `${matches.length} of ${iconNames.length}`}
        </span>
      </div>
      {matches.length ? (
        <ul className="icon-grid">
          {matches.slice(0, limit).map((name) => (
            <IconCard key={name} name={name} />
          ))}
        </ul>
      ) : (
        <p className="icon-empty">No icons match “{query.trim()}”.</p>
      )}
      {matches.length > limit && (
        <button ref={more} type="button" className="icon-more" onClick={() => setLimit((n) => n + BATCH)}>
          Show more icons ({matches.length - limit} left)
        </button>
      )}
    </>
  );
}

export function IconsPage({ code, versionPrefix }: { code: IconsCode; versionPrefix: string }) {
  return (
    <DocPage headings={HEADINGS}>
      <PageHeader
        eyebrow="Foundations"
        title={iconsPage.title}
        description={iconsPage.description}
        badges={[`${iconNames.length} icons`, "24px grid", "1.8px stroke"]}
      />

      <h2 id="installation">Installation</h2>
      <p>
        With the CDN script there's nothing to install — icons are part of ParseUI. For React components, add the npm
        package.
      </p>
      <CodeTabs items={code.installation} />

      <h2 id="usage">Usage</h2>
      <p>
        <Inline text={'With the CDN, write `<i icon="name">` inside `<parse-ui>` — it takes the text color, and sits at 16px inside buttons. On npm, each icon is a React component.'} />
      </p>
      <CodeTabs items={code.usage} />

      <h3 id="size-and-color">Size and color</h3>
      <p>
        <Inline text="`size` sets width and height, `stroke-width` the line weight. Color comes from the CSS `color`, so an icon matches the text around it." />
      </p>
      <PreviewCard markup={iconsPage.customizeMarkup} code={code.customize} />

      <h3 id="attributes">Attributes</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Values</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {iconsPage.attributes.map(([attribute, values, fallback, description]) => (
              <tr key={attribute}>
                <td>
                  <code>{attribute}</code>
                </td>
                <td>
                  <code>{values}</code>
                </td>
                <td>{fallback === "—" ? fallback : <code>{fallback}</code>}</td>
                <td>
                  <Inline text={description} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 id="without-the-cdn">Without the CDN</h3>
      <p>
        <Inline text="By default each `<i icon>` fetches its SVG from cdn.parseui.com once, then reuses it. To make no requests at all, register the set from npm — or point ParseUI at SVGs you host." />
      </p>
      <CodeTabs items={code.offline} />

      <h2 id="icon-set">Icon set</h2>
      <p>Hover or tap an icon to copy it as HTML, SVG, or JSX.</p>
      <IconGrid />

      <PrevNext path="/icons" versionPrefix={versionPrefix} />
    </DocPage>
  );
}
