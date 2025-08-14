import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import swc from "unplugin-swc";

export default defineConfig({
  plugins: [tsconfigPaths(), react(), swc.vite({ module: { type: "es6" } })],
  test: {
    environment: "jsdom",
    globals: true,
    root: "./",
    setupFiles: "./vitest.setup.ts",
  },
});
