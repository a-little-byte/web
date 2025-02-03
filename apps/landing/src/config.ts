import { urlValidator } from "@alittlebyte/common/validators"
import { z } from "zod"

const landingConfigSchema = z.object({
	services: z.object({
		auth: z.object({
			baseURL: urlValidator,
			twoFactorPage: z.string(),
			sessionKey: z.string(),
		}),
	}),
})
const data = {
	services: {
		auth: {
			baseURL: import.meta.env.VITE_SERVICES_AUTH_BASEURL,
			twoFactorPage: "",
			sessionKey: "SESSION_KEY",
		},
	},
} satisfies z.input<typeof landingConfigSchema>

export const landingConfig = (() => {
	try {
		return landingConfigSchema.parse(data)
	} catch (error) {
		const { errors } = error as z.ZodError
		const formattedErrors = errors.map(
			({ path, message }) => `\t- ${path.join(".")}: ${message}\n`,
		)

		throw new Error(`invalid config\n${formattedErrors.join("")}`)
	}
})()
