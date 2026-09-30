import type { CodeVariant } from "./code";

export interface ComponentExample {
  id: string;
  title: string;
  description: string;
  /** Plain HTML — rendered live in the preview and turned into the CDN/npm code tabs. */
  markup: string;
}

export interface ApiTable {
  title: string;
  description?: string;
  columns: string[];
  rows: string[][];
  /** Column indexes rendered as <code> (skipped for "—"). */
  codeColumns?: number[];
}

/** Everything one component page needs. Plain data (no React), so it's usable on the server and the client. */
export interface ComponentDoc {
  slug: string;
  title: string;
  description: string;
  badges: string[];
  hero: string;
  installation: CodeVariant[];
  usage: string;
  examples: ComponentExample[];
  api: ApiTable[];
  accessibility: string[];
  keyboard: [string, string][];
}
