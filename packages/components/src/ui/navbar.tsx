import { cn } from "@alittlebyte/components/lib/cn"
import { Link } from "@tanstack/react-router"

export type NavLink = {
	label: string
	href: string
}

type NavbarProps = {
	navLinks: NavLink[]
}

export const Navbar = ({ navLinks }: NavbarProps) => (
	<nav className="w-full bg-gradient-to-tr from-[#302082] to-[#4931b3] p-4 text-white">
		<div className="container flex items-center justify-between">
			<div className="text-2xl font-bold">Cyna</div>
			<div className="hidden space-x-6 md:flex">
				{navLinks.map(({ label, href }) => (
					<Link
						key={label}
						to={href}
						className={cn(
							window.location.pathname === href ? "opacity-100" : "opacity-50",
							"hover:text-gray-300",
						)}
					>
						{label}
					</Link>
				))}
			</div>
		</div>
	</nav>
)
