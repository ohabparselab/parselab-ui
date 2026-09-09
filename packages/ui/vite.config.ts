import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  // Vite's per-file TS transform (strips types, downlevels decorators/
  // accessor fields) is a SEPARATE esbuild pass from `build.target`
  // below (which only governs the final bundle's minify/downlevel
  // target) — without this, esbuild parses `accessor` as a plain
  // identifier instead of the ES2022 keyword, and chokes on decorated
  // accessor fields like `@reflect() accessor variant = ...`.
  esbuild: {
    target: "es2022",
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        react: resolve(__dirname, "src/react.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        format === "es" ? `esm/${entryName}.js` : `cjs/${entryName}.cjs`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "@lit/react"],
      output: {
        preserveModules: false,
      },
    },
    sourcemap: true,
    target: "es2022",
  },
});
