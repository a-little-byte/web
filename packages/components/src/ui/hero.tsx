import { PropsWithChildren } from "react"

type HeroProps = {
	imageUrl: string
	title: string
	description: string
}

export const Hero = ({
	imageUrl,
	title,
	description,
	children,
}: PropsWithChildren<HeroProps>) => (
	<div className="relative h-96">
		<img src={imageUrl} alt="Hero" className="h-full w-full object-cover" />
		<div className="absolute inset-0 flex items-center bg-black bg-opacity-50">
			<div className="container mx-auto px-6">
				<h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
					{title}
				</h1>
				<p className="font-bold text-white">{description}</p>
			</div>
			{children}
		</div>
	</div>
)
