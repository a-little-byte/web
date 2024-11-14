/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { urlValidator } from "@alittlebyte/common/validators"
import "dotenv/config"
import { z } from "zod"

const apiConfigSchema = z.object({
	cors: z.object({
		origin: z.array(z.string()),
	}),
	services: z.object({
		auth: z.object({
			totp: z.object({
				issuer: z.string(),
			}),
		}),
	}),
	server: z.object({
		port: z.string(),
	}),
	db: z.object({
		connectionString: urlValidator,
	}),
})
const data = {
	cors: {
		origin: process.env.API_CORS_ORIGIN!.split(","),
	},
	services: {
		auth: {
			totp: {
				issuer: "a-little-byte",
			},
		},
	},
	db: {
		connectionString: process.env.DATABASE_URL!,
	},
	server: {
		port: process.env.API_SERVER_PORT!,
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
