import { Hono } from "hono"
import { z } from "zod"
import { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import { zValidator } from "@hono/zod-validator"
import {
	creditCardValidator,
	idValidator,
} from "@alittlebyte/common/validators"

export const creditCardRouter = () =>
	new Hono<{ Variables: PrivateContextVariables }>().post(
		"/",
		zValidator("param", z.object({ userId: idValidator })),
		zValidator("json", creditCardValidator),
		async (c) => {
			const { userId } = c.req.valid("param")
			const { prisma } = c.var
			const data = c.req.valid("json")
			try {
				const newCreditCard = await prisma.creditCard.create({
					data: {
						...data,
						userId,
					},
				})
				return c.json(newCreditCard, 201)
			} catch (error) {
				console.error(error)
				return c.json({ error: "Failed to create credit card" }, 500)
			}
		},
	)
