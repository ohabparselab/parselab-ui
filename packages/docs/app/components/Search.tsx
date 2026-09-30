import { Fragment, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { queryTerms, searchEntries, snippet, type SearchEntry } from "~/lib/search";

// One request per version per session; a failed request is retried next open.
const indexCache = new Map<string, Promise<SearchEntry[]>>();

function loadIndex(version: string | undefined): Promise<SearchEntry[]> {
  const key = version ?? "";
  let pending = indexCache.get(key);
  if (!pending) {
    pending = fetch(`/api/search${version ? `?version=${encodeURIComponent(version)}` : ""}`).then((response) => {
      if (!response.ok) throw new Error(`Search index: ${response.status}`);
      return response.json() as Promise<SearchEntry[]>;
    });
    pending.catch(() => indexCache.delete(key));
    indexCache.set(key, pending);
  }
  return pending;
}

function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.4" />
    <path d="m10.5 10.5 3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/** `text` with every search term wrapped in <mark>. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>;
  const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return (
    <>
      {text.split(pattern).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

function SearchDialog({
  version,
  versionPrefix,
  onClose,
}: {
  version: string | undefined;
  versionPrefix: string;
  onClose: () => void;
}) {
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let live = true;
    loadIndex(version).then(
      (index) => live && setEntries(index),
      () => live && setFailed(true),
    );
    return () => {
      live = false;
    };
  }, [version]);

  // Focus the input and lock page scroll while open.
  useEffect(() => {
    inputRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const terms = useMemo(() => queryTerms(query), [query]);
  // No query yet: list the pages themselves as quick links.
  const results = useMemo(
    () => (entries ? (terms.length ? searchEntries(entries, query) : entries.filter((e) => !e.heading)) : []),
    [entries, terms, query],
  );

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function open(entry: SearchEntry) {
    onClose();
    navigate(`${versionPrefix}${entry.path}`);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length) {
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActive((i) => (i + step + results.length) % results.length);
      }
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      open(results[active]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "Tab") {
      // Focus stays in the input; arrows move through results.
      event.preventDefault();
    }
  }

  let status: string | null = null;
  if (failed) status = "Search is unavailable right now.";
  else if (!entries) status = "Loading…";
  else if (terms.length && !results.length) status = `No results for “${query.trim()}”.`;

  return (
    <div
      className="search-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="Search documentation" onKeyDown={onKeyDown}>
        <div className="search-input-row">
          <SearchIcon />
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search docs…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `search-result-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="search-esc">Esc</kbd>
        </div>

        {status ? (
          <p className="search-status">{status}</p>
        ) : (
          <ul className="search-results" id="search-results" role="listbox" ref={listRef}>
            {!terms.length && <li className="search-group-label" role="presentation">Pages</li>}
            {results.map((entry, index) => (
              <li
                key={entry.path}
                id={`search-result-${index}`}
                role="option"
                aria-selected={index === active}
                className="search-result"
                onMouseMove={() => setActive(index)}
              >
                <Link to={`${versionPrefix}${entry.path}`} onClick={onClose} tabIndex={-1}>
                  <span className="search-result-path">
                    {entry.section}
                    {entry.heading ? ` › ${entry.page}` : ""}
                  </span>
                  <span className="search-result-title">
                    <Highlight text={entry.heading ?? entry.page} terms={terms} />
                  </span>
                  {terms.length > 0 && entry.text && (
                    <span className="search-result-snippet">
                      <Highlight text={snippet(entry.text, terms)} terms={terms} />
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="search-footer">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> to navigate
          </span>
          <span>
            <kbd>↵</kbd> to open
          </span>
          <span>
            <kbd>Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}

/** Top-bar search button plus the ⌘K / Ctrl+K (and "/") search dialog. */
export function Search({ version, versionPrefix }: { version: string | undefined; versionPrefix: string }) {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent));
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === "/" && !isEditable(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="search-trigger"
        aria-label="Search docs"
        aria-keyshortcuts="Meta+K Control+K"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
        <span className="search-trigger-label">Search docs</span>
        <kbd>{isMac ? "⌘" : "Ctrl"} K</kbd>
      </button>
      {open && <SearchDialog version={version} versionPrefix={versionPrefix} onClose={close} />}
    </>
  );
}
