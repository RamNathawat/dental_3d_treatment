import { defineConfig } from "vite";

// A GitHub Pages project site is served from /<repository>/, so the base is set at build time.
// An empty value means the site is at the root — `||` rather than `??` because the Pages action
// reports a user site as an empty string.
export default defineConfig({
  base: process.env["VITE_BASE"] || "/",
  server: {
    port: 5173,
    open: "/treatment.html",
    // Allow Vite to serve files from the workspace root so the public/models symlink resolves.
    fs: {
      allow: ["."],
    },
  },
  build: {
    target: "es2022",
    sourcemap: true,
    // Multi-page: the original jaw-scan viewer and the new treatment viewer.
    rollupOptions: {
      input: {
        main: new URL("index.html", import.meta.url).pathname,
        treatment: new URL("treatment.html", import.meta.url).pathname,
      },
    },
  },
});
