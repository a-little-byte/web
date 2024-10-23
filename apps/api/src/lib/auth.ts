import { apiConfig } from "@alittlebyte/api/config"
import prismaDb from "@alittlebyte/api/lib/prisma"
import {
	firstNameValidator,
	lastNameValidator,
} from "@alittlebyte/common/validators"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { twoFactor } from "better-auth/plugins"

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			firstName: {
				type: "string",
				required: true,
				validator: firstNameValidator,
			},
			lastName: {
				type: "string",
				required: true,
				validator: lastNameValidator,
			},
		},
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

export type Session = typeof auth.$Infer.Session.session

export type User = typeof auth.$Infer.Session.user
