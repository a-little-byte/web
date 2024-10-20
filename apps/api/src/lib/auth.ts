import { apiConfig } from "@alittlebyte/api/config"
import prismaDb from "@alittlebyte/api/lib/prisma"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { twoFactor } from "better-auth/plugins"

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	database: prismaAdapter(prismaDb, {
		provider: "postgresql",
	}),
	plugins: [
		twoFactor({
			issuer: apiConfig.services.auth.totp.issuer,
		}),
	],
})
