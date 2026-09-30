/**
 * Public URL of the docs site, used in the Markdown served to AI agents
 * (llms.txt, /llms/*.md) and in guide pages via `{{site}}`. Set VITE_SITE_URL
 * when the docs are deployed somewhere else.
 */
export const SITE_URL: string = (import.meta.env.VITE_SITE_URL || "https://parseui.com").replace(/\/$/, "");

/** Replaces `{{site}}` in Markdown with SITE_URL. */
export const withSite = (markdown: string): string => markdown.replaceAll("{{site}}", SITE_URL);
