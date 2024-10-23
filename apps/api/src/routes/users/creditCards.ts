import { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import { HTTP_STATUS_CODES } from "@alittlebyte/common/constants"
import {
	creditCardValidator,
	idValidator,
} from "@alittlebyte/common/validators"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

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

				return c.json(newCreditCard, HTTP_STATUS_CODES.CREATED)
			} catch (error) {
				return c.json(
					{ error: "Failed to create credit card" },
					HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
				)
			}
		},
	)
