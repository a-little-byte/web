import { apiConfig } from "@alittlebyte/api/config"
import { dialect } from "@alittlebyte/api/database"
import { sendEmail } from "@alittlebyte/api/grpc/emails/emailClient"
import {
	firstNameValidator,
	lastNameValidator,
} from "@alittlebyte/common/validators"
import { forgotPasswordTemplate } from "@alittlebyte/components/templates/ForgotPasswordTemplate"
import { verifyEmailTemplate } from "@alittlebyte/components/templates/VerifyEmailTemplate"
import { betterAuth } from "better-auth"
import { twoFactor } from "better-auth/plugins"

const {
	trustedOrigins,
	totp: { issuer },
} = apiConfig.services.auth

export const auth = betterAuth({
	onAPIError: {
		throw: true,
	},
	trustedOrigins,
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmail(
				user.email,
				"Verify your email address",
				await verifyEmailTemplate(url),
			)
		},
	},
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ url, user }) => {
			await sendEmail(
				user.email,
				"Reset Your Password",
				await forgotPasswordTemplate(url),
			)
		},
		requireEmailVerification: true,
	},
	user: {
		modelName: "users",
		additionalFields: {
			firstName: {
				type: "string",
				required: true,
				validator: {
					input: firstNameValidator,
					output: firstNameValidator,
				},
			},
			lastName: {
				type: "string",
				required: true,
				validator: {
					input: lastNameValidator,
					output: lastNameValidator,
				},
			},
		},
	},
	account: {
		modelName: "accounts",
	},
	session: {
		modelName: "sessions",
	},
	database: {
		dialect,
		type: "postgres",
		generateId: () => crypto.randomUUID(),
	},
	plugins: [
		twoFactor({
			issuer,
		}),
	],
})

export type Session = typeof auth.$Infer.Session.session

export type User = typeof auth.$Infer.Session.user
