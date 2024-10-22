import prismaDb from "@alittlebyte/api/lib/prisma"
import { PublicContextVariables } from "@alittlebyte/api/utils/types"
import { Context, Next } from "hono"

export const dbMiddleware = async (
	ctx: Context<{ Variables: PublicContextVariables }>,
	next: Next,
) => {
	ctx.set("db", prismaDb)

	return await next()
}
