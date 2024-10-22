import { Hono } from "hono"
import { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import { creditCardRouter } from "@alittlebyte/api/routes/users/creditCards"

export const usersRouter = () =>
	new Hono<{ Variables: PrivateContextVariables }>().route(
		"/:userId/credit-cards",
		creditCardRouter(),
	)
