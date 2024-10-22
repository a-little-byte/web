import { Hono } from "hono"
import { PrivateContextVariables } from "@alittlebyte/api/utils/types"

export const creditCardRouter = () =>
	new Hono<{ Variables: PrivateContextVariables }>()
		.get("/", (c) => {
			return c.json({})
		})
		.post("/", async (c) => {
			const { prisma } = c.var
			const data = await c.req.json()
			try {
				const newCreditCard = await prisma.creditCard.create({ data })
				return c.json(newCreditCard, 201)
			} catch (error) {
				console.error(error)
				return c.json({ error: "Failed to create credit card" }, 500)
			}
		})
