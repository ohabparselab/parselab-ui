import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8"));

export default defineConfig({
  define: {
    __PARSEUI_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Every browser with the shadow DOM/custom elements features ParseUI
    // needs also supports ES2022 (native #private fields, no helpers).
    target: "es2022",
    sourcemap: true,
    lib: {
      entry: "src/index.ts",
      // `ParseUI` becomes `window.ParseUI` in the IIFE (CDN) build.
      name: "ParseUI",
      formats: ["es", "iife"],
      fileName: (format) => (format === "es" ? "parseui.js" : "parseui.min.js"),
    },
  },
});
