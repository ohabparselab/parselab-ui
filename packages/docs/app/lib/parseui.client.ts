/**
 * Starts ParseUI in the browser, exactly as an npm user would — through the
 * package's loader. Imported once from root.tsx (`.client` = browser only).
 *
 * The docs load this repo's own CDN build (served at /parseui.min.js by
 * routes/parseui[.]min[.]js.ts) so previews always match the source; set
 * VITE_PARSEUI_SRC to try another build, e.g. the live CDN file.
 */
import { load, registerIcons } from "parseui";
import { icons } from "@parseui/icons";

load({ src: import.meta.env.VITE_PARSEUI_SRC || "/parseui.min.js" }).catch((error: unknown) => console.error(error));

// Previews render icons from the package instead of fetching each one.
registerIcons(icons);
