import { FC } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "./card"
import { Link } from "@tanstack/react-router"

type CardCatagorieProps = {
	title: string
	link: string
	description: string
}

export const CardCatagorie: FC<CardCatagorieProps> = ({
	title,
	link,
	description,
}) => (
	<div className="flex gap-4 py-4">
		<Link to={link} className="w-72 flex-shrink-0">
			<Card className="h-full w-full rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
				<CardContent className="flex h-full flex-col justify-between p-6">
					<div>
						<CardTitle className="mb-2 text-lg font-semibold">
							{title}
						</CardTitle>
						<CardDescription className="text-sm text-gray-600">
							{description}
						</CardDescription>
					</div>
				</CardContent>
			</Card>
		</Link>
	</div>
)
