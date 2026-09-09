import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
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
      external: ["react", "react-dom", "lit", "@lit/react"],
      output: {
        preserveModules: false,
      },
    },
    sourcemap: true,
    target: "es2022",
  },
});
