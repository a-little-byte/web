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
			jwtSecret: z.string(),
			totp: z.object({
				issuer: z.string(),
			}),
			trustedOrigins: z.array(urlValidator),
		}),
		stripe: z.object({
			secretKey: z.string(),
			publishKey: z.string(),
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
		url: urlValidator,
	}),
})
const data = {
	cors: {
		origin: process.env.API_CORS_ORIGIN!.split(","),
	},
	services: {
		auth: {
			jwtSecret: "its-a-secret",
			totp: {
				issuer: "a-little-byte",
			},
			trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS!.split(","),
		},
		stripe: {
			secretKey: process.env.STRIPE_SECRET_KEY!,
			publishKey: process.env.STRIPE_PUBLISH_KEY!,
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
		url: process.env.LANDING_URL!,
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
