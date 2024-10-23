import { Hono } from "hono"
import { z } from "zod"
import { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import { zValidator } from "@hono/zod-validator"
import { idValidator } from "@alittlebyte/common/validators"

export const creditCardRouter = () =>
	new Hono<{ Variables: PrivateContextVariables }>().post(
		"/",
		zValidator("param", z.object({ userId: idValidator })),
		async (c) => {
			const { userId } = c.req.valid("param")
			const { prisma, user } = c.var
			const data = await c.req.json()
			try {
				if (userId != user.id) {
					c.json({ error: "Forbidden" }, 403)
				}

				const newCreditCard = await prisma.creditCard.create({ data })
				return c.json(newCreditCard, 201)
			} catch (error) {
				console.error(error)
				return c.json({ error: "Failed to create credit card" }, 500)
			}
		},
	)
