import { defineConfig } from "vite";

// Minimal React harness for checking <parse-ui> against React's DOM updates.
export default defineConfig({
  root: __dirname,
  esbuild: { jsx: "automatic" },
  server: { port: 4331 },
});
