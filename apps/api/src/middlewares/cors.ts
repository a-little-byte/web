import { apiConfig } from "@alittlebyte/api/config"
import { cors } from "hono/cors"

export const corsMiddleware = cors({
	origin: apiConfig.cors.origin.split(","),
	allowHeaders: ["Content-Type", "Authorization"],
	allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
	exposeHeaders: ["Content-Length"],
	maxAge: 600,
	credentials: true,
})
