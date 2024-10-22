import { apiConfig } from "@alittlebyte/api/config"
import { authMiddleware } from "@alittlebyte/api/middlewares/auth"
import { corsMiddleware } from "@alittlebyte/api/middlewares/cors"
import { dbMiddleware } from "@alittlebyte/api/middlewares/db"
import { authRouter } from "@alittlebyte/api/routes/auth"
import { usersRouter } from "@alittlebyte/api/routes/users"
import { PublicContextVariables } from "@alittlebyte/api/utils/types"
import { serve } from "@hono/node-server"
import { Hono } from "hono"

const { port } = apiConfig.server
const app = new Hono<{ Variables: PublicContextVariables }>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const router = app
	.use(corsMiddleware)
	.use(dbMiddleware)
	.route("/auth", authRouter())
	.use(authMiddleware)
	.route("/users", usersRouter())

console.log(`Server is running on port ${port}`)

serve({
	fetch: app.fetch,
	port,
})

export type ApiRouter = typeof router
