import { apiConfig } from "@alittlebyte/api/config"
import { authMiddleware } from "@alittlebyte/api/middlewares/auth"
import { corsMiddleware } from "@alittlebyte/api/middlewares/cors"
import { dbMiddleware } from "@alittlebyte/api/middlewares/db"
import { authRouter } from "@alittlebyte/api/routes/auth"
import { backofficeExample } from "@alittlebyte/api/routes/backofficeExample"
import { servicesRouter } from "@alittlebyte/api/routes/services"
import { usersRouter } from "@alittlebyte/api/routes/users"
import type { PublicContextVariables } from "@alittlebyte/api/utils/types"
import { HTTP_STATUS_CODES } from "@alittlebyte/common/constants"
import { Hono } from "hono"

const { port } = apiConfig.server
const app = new Hono<{ Variables: PublicContextVariables }>()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const router = app
	.onError((err, c) => {
		// eslint-disable-next-line no-console
		console.error(err)

		return c.json("SERVER ERROR", HTTP_STATUS_CODES.BAD_GATEWAY)
	})
	.use(corsMiddleware)
	.use(dbMiddleware)
	.route("/auth", authRouter())
	.route("/services", servicesRouter())
	.route("/example", backofficeExample())
	.use(authMiddleware)
	.route("/users", usersRouter())

export default {
	fetch: app.fetch,
	port: parseInt(port, 10),
}

export type ApiRouter = typeof router
