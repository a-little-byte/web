import { Context } from "hono"
import { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import type { Next } from "hono"
import { z } from "zod"
import { idValidator } from "@alittlebyte/common/validators"
import { HTTP_STATUS_CODES } from "@alittlebyte/common/constants"

type UserIdInput = {
	in: {
		param: {
			userId: z.input<typeof idValidator>
		}
	}
	out: {
		param: {
			userId: z.output<typeof idValidator>
		}
	}
}

export const isUserEqualtoUserLogin = async (
	{
		req,
		var: { user },
		json,
	}: Context<{ Variables: PrivateContextVariables }, string, UserIdInput>,
	next: Next,
) => {
	const { userId } = req.valid("param")
	if (userId !== user.id) {
		return json({ error: "Forbidden" }, HTTP_STATUS_CODES.FORBIDDEN)
	}

	await next()
}