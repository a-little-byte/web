import { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { Navbar } from "@alittlebyte/components/ui/navbar"
import { Footer } from "@alittlebyte/components/ui/footer"

const links = [
	{
		label: "Home",
		href: "/",
		isActive: window.location.pathname === "/",
	},
	{
		label: "Products",
		href: "/products",
		isActive: window.location.pathname === "/products",
	},
	{
		label: "Categories",
		href: "/categories",
		isActive: window.location.pathname === "/categories",
	},
	{
		label: "Services",
		href: "/services",
		isActive: window.location.pathname === "/services",
	},
	{
		label: "About",
		href: "/about",
		isActive: window.location.pathname === "/about",
	},
	{
		label: "Sign up",
		href: "/sign-up",
		isActive: window.location.pathname === "/sign-up",
	},
	{
		label: "Sign in",
		href: "/sign-in",
		isActive: window.location.pathname === "/sign-in",
	},
]

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		component: () => (
			<>
				<div className="flex gap-2">
					<Navbar links={links} />
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
