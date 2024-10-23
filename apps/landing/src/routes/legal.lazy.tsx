import { createLazyFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

type Section = {
	title: string
	content: string
}

const Legal = () => {
	const [t] = useTranslation("legal")
	const section = t("legal:section", { returnObjects: true }) as Section[]

	return (
		<div className="mx-auto my-10 max-w-4xl rounded-lg bg-white p-8 shadow-lg">
			<h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
				{t("legal:title")}
			</h1>

			<p className="mb-8 text-center text-gray-500">
				<strong>{t("legal:effectiveDate")}</strong>
			</p>

			<p className="mb-6 leading-relaxed text-gray-700">
				{t("legal:welcome_legal")}
			</p>

			{section.map((item: Section, index: number) => (
				<div key={index}>
					<h2 className="mb-4 text-xl font-semibold text-gray-800">
						{item.title}
					</h2>
					<p className="mb-6 leading-relaxed text-gray-700">{item.content}</p>
				</div>
			))}

			<p className="mt-8 text-center font-bold leading-relaxed text-gray-700">
				{t("legal:acknowledgement")}
			</p>
		</div>
	)
}

export const Route = createLazyFileRoute("/legal")({
	component: Legal,
})
