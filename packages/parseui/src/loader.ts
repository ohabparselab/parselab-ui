/**
 * The npm package's entry. It contains none of ParseUI's code: importing it
 * adds the CDN script for this exact version to the page, so npm and
 * vanilla-JS sites run the very same file from the CDN.
 *
 *   import "parseui";                        // loads from the CDN
 *   import { registerIcons } from "parseui"; // works before the script arrives
 *   await load({ src: "…" });                // optional: choose when/where
 *
 * Only type imports from the library below — they're erased, so the
 * library's code never ends up in this file.
 */
import type { ComponentDefinition } from "./core/registry";
import type { ParseUIApi, ParseUIStub, QueuedCall } from "./core/api";

export type { ComponentDefinition } from "./core/registry";

export const version: string = __PARSEUI_VERSION__;

/** The CDN script this package loads — pinned to the installed version. */
export const CDN_URL = `https://cdn.parseui.com/${version}/parseui.min.js`;

/** `window.ParseUI` once the CDN script has run. */
export interface ParseUIGlobal extends ParseUIApi {
  version: string;
}

export interface LoadOptions {
  /** Script URL. Defaults to CDN_URL. Only the first load() decides. */
  src?: string;
}

type Slot = { ParseUI?: ParseUIGlobal | Partial<ParseUIStub> };

const inBrowser = typeof window !== "undefined" && typeof document !== "undefined";
let loading: Promise<ParseUIGlobal> | null = null;

function loaded(): ParseUIGlobal | undefined {
  const global = (window as Slot).ParseUI;
  return global && "registerComponent" in global && typeof global.registerComponent === "function"
    ? (global as ParseUIGlobal)
    : undefined;
}

/**
 * Loads ParseUI from the CDN (once) and resolves with `window.ParseUI`.
 * Importing the package already calls this on the next microtask, so call
 * it yourself only to pick a different `src` — synchronously, at startup.
 */
export function load(options: LoadOptions = {}): Promise<ParseUIGlobal> {
  if (!inBrowser) return Promise.reject(new Error("parseui: load() only runs in a browser."));
  if (loading) return loading;

  const ready = loaded();
  if (ready) return (loading = Promise.resolve(ready));

  const src = options.src ?? CDN_URL;
  loading = new Promise<ParseUIGlobal>((resolve, reject) => {
    // Reuse a script already on the page (e.g. added by hand) instead of loading twice.
    let script = document.querySelector<HTMLScriptElement>('script[data-parseui], script[src$="/parseui.min.js"]');
    if (!script) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.parseui = "";
      document.head.append(script);
    }
    script.addEventListener("load", () => {
      const global = loaded();
      if (global) resolve(global);
      else reject(new Error(`parseui: ${script!.src} loaded but didn't define window.ParseUI.`));
    });
    script.addEventListener("error", () => {
      loading = null;
      script!.remove();
      reject(new Error(`parseui: couldn't load ${script!.src}. Check the URL, your network, and that your Content-Security-Policy allows it.`));
    });
  });
  return loading;
}

/** Runs now if ParseUI is loaded, else queues the call for the CDN script to replay on startup. */
function call(...entry: QueuedCall): void {
  if (!inBrowser) return;
  const global = loaded();
  if (global) {
    (global[entry[0]] as (...args: unknown[]) => void)(...entry[1]);
    return;
  }
  const slot = window as Slot;
  const stub = (slot.ParseUI ??= { q: [] }) as Partial<ParseUIStub>;
  (stub.q ??= []).push(entry);
}

/** Adds a component's CSS (and optional setup) to every `<parse-ui>`. */
export function registerComponent(definition: ComponentDefinition): void {
  call("registerComponent", [definition]);
}

/** Makes icons available by name without a network request: `{ name: innerSvgMarkup }`. */
export function registerIcons(icons: Record<string, string>): void {
  call("registerIcons", [icons]);
}

/** Where `<i icon>` loads SVGs from. Default `https://cdn.parseui.com/icons/1.0.0/`. */
export function setIconBaseUrl(url: string): void {
  call("setIconBaseUrl", [url]);
}

// Load automatically — but on a microtask, so a load({ src }) or any
// register*() call made synchronously by the importing module comes first.
if (inBrowser) {
  queueMicrotask(() => {
    if (!loading) load().catch((error: unknown) => console.error(error));
  });
}
