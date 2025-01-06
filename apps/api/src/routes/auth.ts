import { auth } from "@alittlebyte/api/lib/auth"
import { Hono } from "hono"

export const authRouter = new Hono().on(["POST", "GET"], "/**", (c) =>
	auth.handler(c.req.raw),
)
