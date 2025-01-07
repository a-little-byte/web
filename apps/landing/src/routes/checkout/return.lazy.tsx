import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/checkout/return")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Thank you so much for your business ❤️</div>
}
