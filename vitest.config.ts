import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./portal"),
    },
  },
  test: {
    // Individual UI tests opt into a DOM with `// @vitest-environment happy-dom`.
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
