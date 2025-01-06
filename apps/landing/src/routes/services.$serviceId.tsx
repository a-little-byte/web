import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { AvalibleBadge } from "@alittlebyte/components/ui/AvalibleBadge"
import { CardOverview } from "@alittlebyte/components/ui/cardOverview"
import { apiClient } from "@alittlebyte/common/lib/apiClient"

const ServiceError = () => {
	const navigate = useNavigate()

	void navigate({
		to: "/",
	})
}
const ServiceDetails = () => {
	const {
		name,
		description,
		technicalSpecifications,
		price,
		perUser,
		perDevice,
		available,
	} = Route.useLoaderData()
	const pricingUser = perUser && "per user"
	const priceingDevice = perDevice && "per device"
	const priceingFlat = (!perUser || !perDevice) && "Flat Rate"

	return (
		<div className="mb-80 h-5/6 p-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<header className="mb-8 space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
							{name}
						</h1>
						<AvalibleBadge available={available} />
					</div>
					<div className="h-1 w-20 rounded-full bg-[#302082]"></div>
				</header>

				<div className="grid gap-8 md:grid-cols-3">
					<div className="space-y-8 md:col-span-2">
						<CardOverview title="Overview">
							<p>{description}</p>
						</CardOverview>

						<CardOverview title="Technical Specifications">
							{technicalSpecifications && (
								<div
									dangerouslySetInnerHTML={{
										__html: technicalSpecifications,
									}}
								/>
							)}
						</CardOverview>
					</div>

					<div className="space-y-6">
						<CardOverview title="Pricing">
							<div className="flex items-baseline space-x-2">
								<span className="text-4xl font-bold">€{price}</span>
								<span>{pricingUser || priceingDevice || priceingFlat}</span>
							</div>
							<div className="border-t border-gray-200 pt-4">
								<p className="text-center text-sm text-gray-100">
									* Pricing subject to terms and conditions.
								</p>
							</div>
						</CardOverview>
					</div>
				</div>
			</div>
		</div>
	)
}

export const Route = createFileRoute("/services/$serviceId")({
	loader: async ({ params: { serviceId } }) => {
		const response = await apiClient.services[":serviceId"].$get({
			param: {
				serviceId,
			},
		})

		if (!response.ok) {
			throw new Error("Could not fetch service")
		}

		const json = await response.json()

		return json.data
	},
	errorComponent: ServiceError,
	component: ServiceDetails,
})
