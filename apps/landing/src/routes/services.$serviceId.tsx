import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { AvalibleBadge } from "@alittlebyte/components/ui/badges"
import { CardOverview } from "@alittlebyte/components/ui/cardOverview"

type Service = {
	id: string
	name: string
	description: string
	technicalSpecifications: string
	price: number
	perUser: boolean
	perDevice: boolean
	available: boolean
}

const fetchService = async (id: string): Promise<{ data: Service }> => {
	const response = await fetch(`http://localhost:3000/services/${id}`)

	if (!response.ok) {
		throw new Error(`Failed to fetch service with ID: ${id}`)
	}

	return (await response.json()) as { data: Service }
}
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
	}: Service = Route.useLoaderData()
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
							<div
								dangerouslySetInnerHTML={{ __html: technicalSpecifications }}
							/>
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
	loader: async ({ params: { serviceId } }): Promise<Service> => {
		const response = await fetchService(serviceId)

		return response.data
	},
	errorComponent: ServiceError,
	component: ServiceDetails,
})
