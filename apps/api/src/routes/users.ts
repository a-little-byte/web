import { isUserEqualToUserLogin } from "@alittlebyte/api/middlewares/isUserEqualtoUserLogin"
import { creditCardRouter } from "@alittlebyte/api/routes/users/creditCards"
import type { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import { idValidator } from "@alittlebyte/common/validators"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

export const usersRouter = () =>
	new Hono<{ Variables: PrivateContextVariables }>()
		.use(
			"/:userId/*",
			zValidator("param", z.object({ userId: idValidator })),
			isUserEqualToUserLogin,
		)
		.route("/:userId/credit-cards", creditCardRouter())
