import { apiClient } from "@alittlebyte/common/lib/apiClient"
import {
	EmbeddedCheckout,
	EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { createLazyFileRoute } from "@tanstack/react-router"
import { useCallback } from "react"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY)
const CheckoutIndex = () => {
	const navigate = Route.useNavigate()
	const fetchClientSecret = useCallback(async () => {
		const res = await apiClient.checkout.$post()

		if (!res.ok) {
			if (res.status === 403) {
				await navigate({
					to: "/sign-in",
				})
			}

			throw new Error("Unable to get a stripe session")
		}

		const data = await res.json()

		if ("error" in data) {
			throw new Error("Unable to get a stripe session")
		}

		return data.clientSecret
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<EmbeddedCheckoutProvider
			stripe={stripePromise}
			options={{ fetchClientSecret }}
		>
			<EmbeddedCheckout />
		</EmbeddedCheckoutProvider>
	)
}

export const Route = createLazyFileRoute("/checkout/")({
	component: CheckoutIndex,
})
