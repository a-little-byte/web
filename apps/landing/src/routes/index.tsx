import { apiClient } from "@alittlebyte/common/lib/apiClient"
import { CardCarousel } from "@alittlebyte/components/ui/cardCarousel"
import { CardCategory } from "@alittlebyte/components/ui/cardCategory"
import { Hero } from "@alittlebyte/components/ui/hero"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

function Index() {
	const { data, error } = useSuspenseQuery(postsQueryOptions())

	if (error) {
		return <div>Error: {error.message}</div>
	}

	return (
		<>
			<Hero
				imageUrl={data.title.image}
				title="Cyna"
				description={data.title.subtitle}
			/>
			<div className="p-6">
				<h1 className="text-4xl">Featured solutions</h1>
				<CardCarousel data={data.carousel} />
			</div>
			<div className="bg-gradient-to-tr from-[#302082] to-[#4931b3] p-6">
				<h1 className="text-4xl">Categories</h1>
				<div className="flex justify-evenly">
					{data.categories.map(({ title, link, description }, i) => (
						<CardCategory
							key={i}
							title={title}
							link={link}
							description={description}
						/>
					))}
				</div>
			</div>
		</>
	)
}

const postsQueryOptions = () =>
	queryOptions({
		queryKey: ["image"],
		queryFn: async () => {
			const response = await apiClient.example.$get()

			if (!response.ok) {
				throw new Error("Network response was not ok")
			}

			return response.json()
		},
	})

export const Route = createFileRoute("/")({
	pendingComponent: () => "Loading",
	loader: async ({ context }) => {
		await context.queryClient.prefetchQuery(postsQueryOptions())
	},
	component: Index,
})
