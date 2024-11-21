import { createLazyFileRoute } from "@tanstack/react-router"
import { Hero } from "@alittlebyte/components/ui/hero"
import { useQuery } from "@tanstack/react-query"
import { CardCarousel } from "@alittlebyte/components/ui/cardCarousel"
import { CardCatagorie } from "@alittlebyte/components/ui/cardCatagorie"

type Content = {
	title: {
		image: string
		subtitle: string
	}
	carousel: [
		{
			title: string
			description: string
			image: string
		},
	]
	catagories: [
		{
			title: string
			link: string
			description: string
		},
	]
}

function Index() {
	const { data, isPending, error } = useQuery({
		queryKey: ["image"],
		queryFn: async () => {
			const response = await fetch("http://localhost:3000/example")

			if (!response.ok) {
				throw new Error("Network response was not ok")
			}

			return (await response.json()) as Content
		},
	})

	if (isPending) {
		return <div>Loading...</div>
	}

	if (error) {
		return <div>Error: {error.message}</div>
	}

	return (
		<>
			<Hero
				imageUrl={data.title.image}
				title="Cyna"
				discription={data.title.subtitle}
			/>
			<div className="p-6">
				<h1 className="text-4xl">Featured solutions</h1>
				<CardCarousel data={data.carousel} />
			</div>
			<div className="bg-gradient-to-tr from-[#302082] to-[#4931b3] p-6">
				<h1 className="text-4xl">Catagories</h1>
				<div className="flex justify-evenly">
					{data.catagories.map(({ title, link, description }, i) => (
						<CardCatagorie
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

export const Route = createLazyFileRoute("/")({
	component: Index,
})
