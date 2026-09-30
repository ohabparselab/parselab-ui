import { registerComponent } from "./core/registry";
import { defineParseUIElement } from "./core/parse-ui";
import { startLegacyTagCompat } from "./core/compat";
import { tokens } from "./tokens/tokens";
import { base } from "./base/base";
import { button } from "./components/button/button";

export { registerComponent } from "./core/registry";
export type { ComponentDefinition } from "./core/registry";

export const version: string = __PARSEUI_VERSION__;

// No-op outside the browser (SSR), so `import "parseui"` is safe to evaluate
// on a server.
if (typeof window !== "undefined" && typeof customElements !== "undefined") {
  // Order matters: later sheets win ties, so tokens → base → components.
  registerComponent(tokens);
  registerComponent(base);
  registerComponent(button);

  defineParseUIElement();
  startLegacyTagCompat();
}
