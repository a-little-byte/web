import { apiConfig } from "@alittlebyte/api/config"
import { dialect } from "@alittlebyte/api/database"
import {
	firstNameValidator,
	lastNameValidator,
} from "@alittlebyte/common/validators"
import { betterAuth } from "better-auth"
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
	database: {
		dialect,
		type: "postgres",
		generateId: false,
	},
	plugins: [
		twoFactor({
			issuer: apiConfig.services.auth.totp.issuer,
		}),
	],
})

export type Session = typeof auth.$Infer.Session.session

export type User = typeof auth.$Infer.Session.user
