import { Badge } from "@alittlebyte/components/ui/badge"

export const AvailableBadge = ({ available }: { available: boolean }) => (
	<Badge variant={available ? "default" : "destructive"} className="text-sm">
		{available ? "Available" : "Unavailable"}
	</Badge>
)
