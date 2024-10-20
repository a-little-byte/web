import { z } from "zod"

const apiConfigSchema = z.object({
	services: z.object({
		auth: z.object({
			totp: z.object({
				issuer: z.string(),
			}),
		}),
	}),
})

const data = {
	services: {
		auth: {
			totp: {
				issuer: "a-little-byte",
			},
		},
	},
} satisfies z.input<typeof apiConfigSchema>

export const apiConfig = (() => {
	try {
		return apiConfigSchema.parse(data)
	} catch (error) {
		const { errors } = error as z.ZodError
		const formattedErrors = errors.map(
			({ path, message }) => `\t- ${path.join(".")}: ${message}\n`,
		)

		throw new Error(`invalid config\n${formattedErrors.join("")}`)
	}
})()
