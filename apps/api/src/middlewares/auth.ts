import { auth } from "@alittlebyte/api/lib/auth"
import type { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import type { Context, Next } from "hono"

export const authMiddleware = async (
	c: Context<{ Variables: PrivateContextVariables }>,
	next: Next,
) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers })

	if (!session) {
		return c.json({ error: "Unauthorized" }, 403)
	}

	c.set("user", session.user)
	c.set("session", session.session)

	return next()
}
