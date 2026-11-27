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
      name: "clean-dist-models-and-sync-portal",
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

        // Automatically sync built assets and treatment.html to portal/public/
        const portalAssets = path.resolve("portal/public/assets");
        const distAssets = path.resolve("dist/assets");
        if (fs.existsSync(distAssets) && fs.existsSync(portalAssets)) {
          fs.cpSync(distAssets, portalAssets, { recursive: true, force: true });
        }
        const distTreatment = path.resolve("dist/treatment.html");
        const portalTreatment = path.resolve("portal/public/treatment.html");
        if (fs.existsSync(distTreatment) && fs.existsSync(path.dirname(portalTreatment))) {
          let html = fs.readFileSync(distTreatment, "utf-8");
          const timestamp = Date.now();
          html = html.replace(/src="\/assets\/treatment-main\.js"/g, `src="/assets/treatment-main.js?v=${timestamp}"`);
          html = html.replace(/href="\/assets\/treatment-main\.css"/g, `href="/assets/treatment-main.css?v=${timestamp}"`);
          fs.writeFileSync(portalTreatment, html, "utf-8");
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
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});

