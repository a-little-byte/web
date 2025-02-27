import type { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import { HTTP_STATUS_CODES } from "@alittlebyte/common/constants"
import {
	creditCardValidator,
	idValidator,
} from "@alittlebyte/common/validators"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

export const creditCardRouter = new Hono<{
	Variables: PrivateContextVariables
}>()
	.post(
		"/",
		zValidator("param", z.object({ userId: idValidator })),
		zValidator("json", creditCardValidator),
		async ({
			json,
			var: {
				repositories: { creditCards },
			},
			req,
		}) => {
			const data = req.valid("json")
			const { userId } = req.valid("param")

			try {
				const newCreditCard = await creditCards.create({
					...data,
					userId,
				})

				return json({ data: newCreditCard }, HTTP_STATUS_CODES.CREATED)
			} catch (error) {
				return json(
					{ error: "Failed to create credit card" },
					HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
				)
			}
		},
	)
	.delete(
		"/:cardId",
		zValidator("param", z.object({ cardId: idValidator })),
		async ({
			req,
			json,
			var: {
				repositories: { creditCards },
			},
		}) => {
			const { cardId } = req.valid("param")

			try {
				const creditCard = await creditCards.findById(cardId)

				if (!creditCard) {
					return json(
						"Credit card doesn't exists",
						HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
					)
				}

				const deleteCreditCard = await creditCards.delete(cardId)

				return json({ data: deleteCreditCard })
			} catch (error) {
				return json(
					{ error: "Failed to delete credit card" },
					HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
				)
			}
		},
	)
