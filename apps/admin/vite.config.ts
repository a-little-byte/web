import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	// eslint-disable-next-line new-cap
	plugins: [react(), tsconfigPaths(), TanStackRouterVite()],
})
