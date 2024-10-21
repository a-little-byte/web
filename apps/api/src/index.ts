import { apiConfig } from "@alittlebyte/api/config"
import prismaDb from "@alittlebyte/api/lib/prisma"
import { authMiddleware } from "@alittlebyte/api/middlewares/auth"
import { corsMiddleware } from "@alittlebyte/api/middlewares/cors"
import { authRouter } from "@alittlebyte/api/routes/auth"
import { PublicContextVariables } from "@alittlebyte/api/utils/types"
import { serve } from "@hono/node-server"
import { Hono } from "hono"

const { port } = apiConfig.server
const app = new Hono<{ Variables: PublicContextVariables }>()

app
	.use(corsMiddleware)
	.use(async (ctx, next) => {
		ctx.set("prisma", prismaDb)

		await next()
	})
	.route("/auth", authRouter())
	.use(authMiddleware)

console.log(`Server is running on port ${port}`)

serve({
	fetch: app.fetch,
	port,
})
