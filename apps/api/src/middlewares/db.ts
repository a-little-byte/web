import { db, repositories } from "@alittlebyte/api/database"
import type { PublicContextVariables } from "@alittlebyte/api/utils/types"
import type { Context, Next } from "hono"

export const dbMiddleware = async (
	ctx: Context<{ Variables: PublicContextVariables }>,
	next: Next,
) => {
	ctx.set("db", db)
	ctx.set("repositories", repositories)

	await next()
}
