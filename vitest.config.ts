import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setup.ts",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  plugins: [react(), tsconfigPaths()],
});
