import "@alittlebyte/common/lib/i18n"
import "@alittlebyte/components/shadcn-ui.css"
import { Toaster } from "@alittlebyte/components/ui/toaster"
import { routeTree } from "@alittlebyte/landing/routeTree.gen"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

const queryClient = new QueryClient()
const router = createRouter({ routeTree, context: { queryClient } })

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

const rootElement = document.getElementById("root")

if (rootElement && !rootElement.innerHTML) {
	const root = createRoot(rootElement)

	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<Toaster />
			</QueryClientProvider>
		</StrictMode>,
	)
}
