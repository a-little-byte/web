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
	onAPIError: {
		throw: true,
	},
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
	},
	plugins: [
		twoFactor({
			issuer,
		}),
	],
})

export type Session = typeof auth.$Infer.Session.session

export type User = typeof auth.$Infer.Session.user
