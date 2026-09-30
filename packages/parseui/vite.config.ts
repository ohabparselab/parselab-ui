import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8"));

/**
 * Two builds (see package.json "build"):
 *
 *   vite build              → dist/cdn/parseui.min.js — the library itself.
 *                             Uploaded to https://cdn.parseui.com/<version>/;
 *                             the only place ParseUI's code is served from.
 *   vite build --mode npm   → dist/npm/parseui.js — the npm package's entry:
 *                             a small loader that adds the CDN script to the
 *                             page. It contains none of the library's code.
 */
export default defineConfig(({ mode }) => {
  const npm = mode === "npm";
  return {
    define: {
      __PARSEUI_VERSION__: JSON.stringify(pkg.version),
    },
    build: {
      outDir: npm ? "dist/npm" : "dist/cdn",
      emptyOutDir: true,
      // Every browser with the shadow DOM/custom elements features ParseUI
      // needs also supports ES2022 (native #private fields, no helpers).
      target: "es2022",
      sourcemap: !npm,
      lib: npm
        ? { entry: "src/loader.ts", formats: ["es"], fileName: () => "parseui.js" }
        : {
            entry: "src/index.ts",
            // `ParseUI` becomes `window.ParseUI`.
            name: "ParseUI",
            formats: ["iife"],
            fileName: () => "parseui.min.js",
          },
    },
  };
});
