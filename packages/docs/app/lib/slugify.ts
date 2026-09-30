/** Heading text → anchor id. Shared by the Markdown renderer, component pages and the search index, so links always match. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
