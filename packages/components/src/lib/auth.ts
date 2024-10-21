import { twoFactorClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = ({
	baseURL,
	twoFactorPage,
}: {
	baseURL: string
	twoFactorPage: string
}) =>
	createAuthClient({
		baseURL,
		plugins: [
			twoFactorClient({
				redirect: true,
				twoFactorPage,
			}),
		],
		fetchOptions: {
			onError(e) {
				if (e.error.status === 429) {
					throw new Error("")
				}
			},
		},
	})
