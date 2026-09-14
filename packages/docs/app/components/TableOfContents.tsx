import { useEffect, useState } from "react";
import type { Heading } from "~/lib/markdown.server";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="toc" aria-label="On this page">
      <span className="toc-label">On this page</span>
      <ul>
        {headings.map((h) => (
          <li key={h.id} className={`toc-depth-${h.depth}`}>
            <a href={`#${h.id}`} className={activeId === h.id ? "active" : undefined}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
