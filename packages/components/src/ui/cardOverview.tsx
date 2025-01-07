import { cn } from "@alittlebyte/components/lib/cn"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@alittlebyte/components/ui/card"
import { ReactNode } from "react"

type CardOverviewProps = {
	title: string
	className?: string
	children: ReactNode
}

export const CardOverview = ({
	children,
	title,
	className,
}: CardOverviewProps) => (
	<Card
		className={cn(
			"relative select-none overflow-hidden border-none bg-[#302080] text-white shadow-md transition-shadow duration-300 hover:shadow-lg",
			className,
		)}
	>
		<CardHeader className="border-b border-white/10">
			<CardTitle className="text-xl font-semibold">{title}</CardTitle>
		</CardHeader>
		<CardContent className="p-6">{children}</CardContent>
	</Card>
)
