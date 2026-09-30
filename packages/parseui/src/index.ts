/**
 * The CDN build — https://cdn.parseui.com/<version>/parseui.min.js, exposed
 * as `window.ParseUI`. This is the only place the library's code ships; the
 * npm package (src/loader.ts) loads this file.
 */
import { registerComponent } from "./core/registry";
import { defineParseUIElement } from "./core/parse-ui";
import { startLegacyTagCompat } from "./core/compat";
import { registerIcons, setIconBaseUrl } from "./core/icons";
import type { ParseUIApi, ParseUIStub } from "./core/api";
import { tokens } from "./tokens/tokens";
import { base } from "./base/base";
import { button } from "./components/button/button";
import { input } from "./components/input/input";
import { buttonGroup } from "./components/button-group/button-group";
import { icon } from "./components/icon/icon";

export { registerComponent } from "./core/registry";
export type { ComponentDefinition } from "./core/registry";
export { registerIcons, setIconBaseUrl } from "./core/icons";

export const version: string = __PARSEUI_VERSION__;

if (typeof window !== "undefined" && typeof customElements !== "undefined") {
  // Order matters: later sheets win ties, so tokens → base → components.
  registerComponent(tokens);
  registerComponent(base);
  registerComponent(button);
  registerComponent(input);
  registerComponent(buttonGroup);
  registerComponent(icon);

  // Calls the npm loader queued while this script was downloading. Still
  // the loader's stub here — the IIFE assigns window.ParseUI after it runs.
  const api: ParseUIApi = { registerComponent, registerIcons, setIconBaseUrl };
  const stub = (window as { ParseUI?: Partial<ParseUIStub> }).ParseUI;
  for (const [method, args] of stub?.q ?? []) {
    (api[method] as (...a: typeof args) => void)(...args);
  }

  defineParseUIElement();
  startLegacyTagCompat();
}
