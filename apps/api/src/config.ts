/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { urlValidator } from "@alittlebyte/common/validators"
import "dotenv/config"
import { z } from "zod"

const apiConfigSchema = z.object({
	cors: z.object({
		origin: z.array(urlValidator),
	}),
	services: z.object({
		auth: z.object({
			totp: z.object({
				issuer: z.string(),
			}),
			trustedOrigins: z.array(urlValidator),
		}),
	}),
	server: z.object({
		port: z.string(),
	}),
	db: z.object({
		connectionString: urlValidator,
	}),
	cache: z.object({
		port: z.string(),
		hostname: z.string(),
	}),
	landing: z.object({
		landingUrl: urlValidator,
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
			trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS!.split(","),
		},
	},
	db: {
		connectionString: process.env.DATABASE_URL!,
	},
	cache: {
		port: process.env.CACHE_PORT!,
		hostname: process.env.CACHE_HOSTNAME!,
	},
	server: {
		port: process.env.API_SERVER_PORT!,
	},
	landing: {
		landingUrl: process.env.LANDING_URL!,
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
