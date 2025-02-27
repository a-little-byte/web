import type { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import { HTTP_STATUS_CODES } from "@alittlebyte/common/constants"
import type { idValidator } from "@alittlebyte/common/validators"
import type { Context, Next } from "hono"
import type { z } from "zod"

interface UserIdInput {
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

export const isUserEqualToUserLogin = async (
	{
		req,
		var: { user },
		json,
	}: Context<{ Variables: PrivateContextVariables }, string, UserIdInput>,
	next: Next,
	// eslint-disable-next-line require-await
) => {
	const { userId } = req.valid("param")

	if (userId !== user.id) {
		return json({ error: "Forbidden" }, HTTP_STATUS_CODES.FORBIDDEN)
	}

	return next()
}
