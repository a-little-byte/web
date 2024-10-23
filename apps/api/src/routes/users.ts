import { Hono } from "hono"
import { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import { creditCardRouter } from "@alittlebyte/api/routes/users/creditCards"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import { idValidator } from "@alittlebyte/common/validators"
import { isUserEqualtoUserLogin } from "@alittlebyte/api/middlewares/isUserEqualtoUserLogin"

export const usersRouter = () =>
	new Hono<{ Variables: PrivateContextVariables }>()
		.use(
			"/:userId/*",
			zValidator("param", z.object({ userId: idValidator })),
			isUserEqualtoUserLogin,
		)
		.route("/:userId/credit-cards", creditCardRouter())
