import { Card, CardContent } from "@alittlebyte/components/ui/card"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from "@alittlebyte/components/ui/carousel"
import { FC } from "react"

type CardCarouselProps = {
	data: Array<{
		title: string
		description: string
		image: string
	}>
}

export const CardCarousel: FC<CardCarouselProps> = ({ data }) => (
	<div className="w-full">
		<Carousel
			className="w-full"
			opts={{
				align: "start",
				loop: true,
				slidesToScroll: 3,
			}}
		>
			<CarouselContent>
				{data.map(({ title, description, image }, i) => (
					<CarouselItem key={i} className="md:basis-1/3 lg:basis-1/3">
						<div className="p-2">
							<Card className="h-full overflow-hidden rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
								<div className="relative">
									<img
										src={image}
										alt={title}
										className="h-48 w-full object-cover"
									/>
									<div className="absolute inset-0 bg-black opacity-20 transition-opacity hover:opacity-10"></div>
								</div>
								<CardContent className="space-y-2 p-4">
									<h3 className="truncate text-lg font-semibold text-gray-800">
										{title}
									</h3>
									<p className="line-clamp-2 text-sm text-gray-600">
										{description}
									</p>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<div className="mt-4 flex items-center justify-center space-x-4">
				<CarouselPrevious className="relative" />
				<CarouselNext className="relative" />
			</div>
		</Carousel>
	</div>
)
