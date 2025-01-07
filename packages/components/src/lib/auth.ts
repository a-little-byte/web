import type { auth } from "@alittlebyte/api/lib/auth"
import {
	inferAdditionalFields,
	twoFactorClient,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = ({
	baseURL,
}: {
	baseURL: string
	twoFactorPage: string
}) =>
	createAuthClient({
		baseURL,
		plugins: [inferAdditionalFields<typeof auth>(), twoFactorClient({})],
		fetchOptions: {
			onError(e) {
				if (e.error.status === 429) {
					throw new Error("")
				}
			},
		},
	})
