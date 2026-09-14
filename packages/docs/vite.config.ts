import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [remix()],
  server: {
    port: 4322,
  },
  // `@parselabllc/ui` is npm-workspace-linked (a symlink into packages/ui),
  // so Vite treats it as source rather than a pre-bundled dependency —
  // its own `import * as React` then resolves to a second React module
  // instance (different internal hook dispatcher), and React throws
  // "Invalid hook call" during hydration. `dedupe` alone isn't enough
  // since the package is skipped by the optimizer entirely; explicitly
  // including it pulls it into the same esbuild pre-bundle pass as the
  // rest of the app, so it shares the one optimized `react` instance.
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["@parselabllc/ui/react"],
  },
});
