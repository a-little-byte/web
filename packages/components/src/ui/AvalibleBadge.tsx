import { Badge } from "@alittlebyte/components/ui/badge"

export const AvalibleBadge = ({ available }: { available: boolean }) => (
	<Badge variant={available ? "default" : "destructive"} className="text-sm">
		{available ? "Available" : "Unavailable"}
	</Badge>
)
