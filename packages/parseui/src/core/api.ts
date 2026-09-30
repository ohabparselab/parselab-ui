import type { ComponentDefinition } from "./registry";

/** The calls the npm loader can make before the CDN script has loaded. */
export interface ParseUIApi {
  registerComponent(definition: ComponentDefinition): void;
  registerIcons(icons: Record<string, string>): void;
  setIconBaseUrl(url: string): void;
}

export type QueuedCall = {
  [K in keyof ParseUIApi]: [K, Parameters<ParseUIApi[K]>];
}[keyof ParseUIApi];

/**
 * What the npm loader leaves on `window.ParseUI` until the CDN script
 * arrives: the calls made so far, replayed by the CDN build before it
 * defines <parse-ui> — so they apply before the first element renders.
 */
export interface ParseUIStub {
  q: QueuedCall[];
}
