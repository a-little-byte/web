import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [{ browser: "chromium" }],
    },
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  plugins: [react(), tsconfigPaths()],
});
