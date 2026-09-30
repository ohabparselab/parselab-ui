/**
 * Starts ParseUI in the browser, exactly as an npm user would — through the
 * package's loader. Imported once from root.tsx (`.client` = browser only).
 *
 * The docs load this repo's own builds so previews always match the source:
 *   /parseui.min.js  the CDN build   (routes/parseui[.]min[.]js.ts)
 *   /icons/<name>.svg the icon files (routes/icons.$file.ts)
 * — the same way sites load them from cdn.parseui.com, so previews fetch only
 * the icons they show. Set VITE_PARSEUI_SRC / VITE_PARSEUI_ICON_BASE to try
 * other builds, e.g. the live CDN.
 */
import { load, setIconBaseUrl } from "parseui";

setIconBaseUrl(import.meta.env.VITE_PARSEUI_ICON_BASE || "/icons/");
load({ src: import.meta.env.VITE_PARSEUI_SRC || "/parseui.min.js" }).catch((error: unknown) => console.error(error));
