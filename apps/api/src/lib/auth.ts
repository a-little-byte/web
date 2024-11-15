import { apiConfig } from "@alittlebyte/api/config"
import { dialect } from "@alittlebyte/api/database"
import { sendEmail } from "@alittlebyte/api/grpc/emails/emailClient"
import {
	firstNameValidator,
	lastNameValidator,
} from "@alittlebyte/common/validators"
import { forgotPasswordTemplate } from "@alittlebyte/components/templates/ForgotPasswordTemplate"
import { betterAuth } from "better-auth"
import { twoFactor } from "better-auth/plugins"

const {
	trustedOrigins,
	totp: { issuer },
} = apiConfig.services.auth

export const auth = betterAuth({
	trustedOrigins,
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ url, user }) => {
			await sendEmail(
				user.email,
				"Reset Your Password",
				await forgotPasswordTemplate(url),
			)
		},
	},
	account: {
		modelName: "accounts",
	},
	session: {
		modelName: "sessions",
	},
	verification: {
		modelName: "verifications",
	},
	user: {
		modelName: "users",
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
	// secondaryStorage: {
	// 	get: async (key) => await redis.get(key),
	// 	set: async (key, value, ttl) => {
	// 		if (ttl) {
	// 			await redis.set(key, JSON.stringify(value), { EX: ttl })
	// 		} else {
	// 			await redis.set(key, JSON.stringify(value))
	// 		}
	// 	},
	// 	delete: async (key) => (await redis.del(key)).toString(),
	// },
	plugins: [
		twoFactor({
			issuer,
			twoFactorTable: "twoFactors",
		}),
	],
})

export type Session = typeof auth.$Infer.Session.session

export type User = typeof auth.$Infer.Session.user
