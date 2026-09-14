import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  server: {
    port: 4326,
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
    // `@parselabllc/ui` is workspace-linked, so its dist output can change
    // (during local `ui` package development) without the lockfile/config
    // inputs Vite normally hashes ever changing — without forcing this,
    // the pre-bundled `@parselabllc/ui/react` chunk keeps the same
    // `?v=` hash across rebuilds, and browsers then cache it as
    // `immutable` forever, silently serving stale component code. `force`
    // makes every dev-server start re-bundle from scratch instead of
    // reusing `node_modules/.vite`.
    force: true,
  },
});
