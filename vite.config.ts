import { defineConfig } from "vite";

// A GitHub Pages project site is served from /<repository>/, so the base is set at build time.
// An empty value means the site is at the root — `||` rather than `??` because the Pages action
// reports a user site as an empty string.
export default defineConfig({
  base: process.env["VITE_BASE"] || "/",
  server: {
    port: 5173,
    open: "/",
    // Allow Vite to serve files from the workspace root so the public/models symlink resolves.
    fs: {
      allow: ["."],
    },
  },
  plugins: [
    {
      name: "clean-dist-models",
      async closeBundle() {
        const fs = await import("node:fs");
        const path = await import("node:path");
        const distNiya = path.resolve("dist/models/NIYA ");
        if (fs.existsSync(distNiya)) {
          fs.rmSync(distNiya, { recursive: true, force: true });
        }
        const distM3d = path.resolve("dist/models/Niya Priority.m3d");
        if (fs.existsSync(distM3d)) {
          fs.rmSync(distM3d, { force: true });
        }
      },
    },
  ],
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

