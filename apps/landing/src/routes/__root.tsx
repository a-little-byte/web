import { Footer } from "@alittlebyte/components/ui/footer"
import { Navbar, NavLink } from "@alittlebyte/components/ui/navbar"
import { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"

const links: NavLink[] = [
	{
		label: "Home",
		href: "/",
	},
	{
		label: "Services",
		href: "/services",
	},
	{
		label: "Legal",
		href: "/legal",
	},
	{
		label: "Sign up",
		href: "/sign-up",
	},
	{
		label: "Sign in",
		href: "/sign-in",
	},
]

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		component: () => (
			<>
				<div className="flex gap-2">
					<Navbar navLinks={links} />
				</div>
				<hr />
				<Outlet />
				<ReactQueryDevtools buttonPosition="top-right" />
				<TanStackRouterDevtools position="bottom-right" />
				<Footer />
			</>
		),
	},
)
