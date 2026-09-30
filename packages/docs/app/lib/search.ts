/** One searchable section of the docs. `heading` is absent for a page's own entry. */
export interface SearchEntry {
  page: string;
  section: string;
  heading?: string;
  /** Relative to the version prefix, e.g. "/components/button#sizes". */
  path: string;
  text: string;
}

export function queryTerms(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

/**
 * Entries containing every term (in the entry's own title, its page's
 * title, or its text), best first. An entry's own title is its heading, or
 * the page title for a page's own entry; hits there count most, an exact
 * match most of all, so "button" puts the Button page above "Form buttons".
 */
export function searchEntries(entries: SearchEntry[], query: string, limit = 20): SearchEntry[] {
  const terms = queryTerms(query);
  if (terms.length === 0) return [];
  const phrase = terms.join(" ");

  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of entries) {
    const own = (entry.heading ?? entry.page).toLowerCase();
    const page = entry.heading ? entry.page.toLowerCase() : "";
    const text = entry.text.toLowerCase();
    let score = own === phrase ? 10 : 0;
    let matchedAll = true;
    for (const term of terms) {
      const inOwn = own.includes(term);
      const inPage = page.includes(term);
      if (!inOwn && !inPage && !text.includes(term)) {
        matchedAll = false;
        break;
      }
      score += (inOwn ? 6 : 0) + (inPage ? 3 : 0) + 1;
      if (own.startsWith(term)) score += 3;
    }
    if (matchedAll) scored.push({ entry, score });
  }
  // Stable sort keeps navigation order among equal scores.
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.entry);
}

/** ~120 characters of `text` around the first term it contains, with ellipses where cut. */
export function snippet(text: string, terms: string[], length = 120): string {
  const lower = text.toLowerCase();
  const hit = terms.map((term) => lower.indexOf(term)).filter((i) => i >= 0).sort((a, b) => a - b)[0];
  if (hit === undefined || text.length <= length) return text.slice(0, length) + (text.length > length ? "…" : "");
  const start = Math.max(0, Math.min(hit - 40, text.length - length));
  return `${start > 0 ? "…" : ""}${text.slice(start, start + length).trim()}${start + length < text.length ? "…" : ""}`;
}
