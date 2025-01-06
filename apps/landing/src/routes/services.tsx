import { apiClient } from "@alittlebyte/common/lib/apiClient"
import { CardCatagorie } from "@alittlebyte/components/ui/cardCatagorie"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

const ServiceError = () => {
	const navigate = useNavigate()

	void navigate({
		to: "/",
	})
}
const Services = () => {
	const { data } = Route.useLoaderData()

	return data
		.filter(({ available }) => available)
		.map(({ id, name, price }) => (
			<CardCatagorie
				key={id}
				title={name}
				link={id}
				description={`Price ${price}`}
			/>
		))
}

export const Route = createFileRoute("/services")({
	loader: async () => {
		const urlParams = new URLSearchParams(window.location.search)
		const orderBy = urlParams.get("orderBy") as
			| "price"
			| "newest"
			| "availability"
			| undefined
		const response = await apiClient.services.$get({
			query: !orderBy ? {} : { orderBy },
		})

		if (!response.ok) {
			throw new Error("Could not fetch service")
		}

		const json = await response.json()

		return json
	},
	errorComponent: ServiceError,
	component: Services,
})
