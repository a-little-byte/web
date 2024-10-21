import { routeTree } from "@alittlebyte/landing/routeTree.gen"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { I18nextProvider } from "react-i18next"
import i18n from "@alittlebyte/landing/src/lib/i18n"

const queryClient = new QueryClient()

const router = createRouter({ routeTree, context: { queryClient } })

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
	const root = createRoot(rootElement)
	root.render(
		<StrictMode>
			<I18nextProvider i18n={i18n}>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</I18nextProvider>
		</StrictMode>,
	)
}
