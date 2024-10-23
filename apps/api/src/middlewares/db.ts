import prismaDb from "@alittlebyte/api/lib/prisma"
import type { PublicContextVariables } from "@alittlebyte/api/utils/types"
import type { Context, Next } from "hono"

export const dbMiddleware = async (
	ctx: Context<{ Variables: PublicContextVariables }>,
	next: Next,
) => {
	ctx.set("prisma", prismaDb)

	await next()
}
