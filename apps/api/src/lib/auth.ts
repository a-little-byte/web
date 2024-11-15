import { apiConfig } from "@alittlebyte/api/config"
import { dialect } from "@alittlebyte/api/database"
import { redis } from "@alittlebyte/api/lib/caching"
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
	secondaryStorage: {
		get: redis.get,
		set: async (key, value, ttl) => {
			if (ttl) {
				await redis.set(key, JSON.stringify(value), { EX: ttl })
			} else {
				await redis.set(key, JSON.stringify(value))
			}
		},
		delete: async (key) => (await redis.del(key)).toString(),
	},
	plugins: [
		twoFactor({
			issuer: apiConfig.services.auth.totp.issuer,
		}),
	],
})

export type Session = typeof auth.$Infer.Session.session

export type User = typeof auth.$Infer.Session.user
