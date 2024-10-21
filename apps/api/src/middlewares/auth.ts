import { auth } from "@alittlebyte/api/lib/auth"
import { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import { Context, Next } from "hono"

export const authMiddleware = async (
	c: Context<{ Variables: PrivateContextVariables }>,
	next: Next,
) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers })

	if (!session) {
		throw new Error("")
	}

	c.set("user", session.user)
	c.set("session", session.session)
	return next()
}
