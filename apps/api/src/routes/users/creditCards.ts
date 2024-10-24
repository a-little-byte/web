import { Hono } from "hono"
import { z } from "zod"
import { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import { zValidator } from "@hono/zod-validator"
import {
	creditCardValidator,
	idValidator,
} from "@alittlebyte/common/validators"
import { HTTP_STATUS_CODES } from "@alittlebyte/common/constants"

export const creditCardRouter = () =>
	new Hono<{ Variables: PrivateContextVariables }>()
		.post(
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
					return c.json(newCreditCard, HTTP_STATUS_CODES.CREATED)
				} catch (error) {
					console.error(error)
					return c.json(
						{ error: "Failed to create credit card" },
						HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
					)
				}
			},
		)
		.delete(
			"/:cardId",
			zValidator("param", z.object({ cardId: idValidator })),
			async (c) => {
				const { cardId } = c.req.valid("param")
				const { prisma } = c.var
				try {
					const creditCard = await prisma.creditCard.findUnique({
						where: {
							id: cardId,
						},
					})

					if (!creditCard) {
						return c.json(
							"Credit card doesn't exists",
							HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
						)
					}
					const deleteCreditCard = await prisma.creditCard.delete({
						where: {
							id: cardId,
						},
					})

					return c.json(deleteCreditCard)
				} catch (error) {
					console.error(error)
					return c.json(
						{ error: "Failed to delete credit card" },
						HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
					)
				}
			},
		)
