import { apiConfig } from "@alittlebyte/api/config"
import {
	hashPassword,
	validatePassword,
} from "@alittlebyte/api/utils/hashPassword"
import { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import {
	emailValidator,
	firstNameValidator,
	lastNameValidator,
	passwordValidator,
} from "@alittlebyte/common/validators"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { sign } from "hono/jwt"
import { UUID } from "node:crypto"
import { z } from "zod"

const createToken = (id: UUID, email: string) =>
	sign({ id, email }, apiConfig.services.auth.jwtSecret)

export const authRouter = new Hono<{ Variables: PrivateContextVariables }>()
	.post(
		"/sign-in",
		zValidator(
			"json",
			z.object({
				email: emailValidator,
				password: passwordValidator,
			}),
		),
		async ({ req, var: { repositories }, json }) => {
			const { email, password } = req.valid("json")
			const user = await repositories.users.findOne({ email })

			if (!user) {
				return json({}, 404)
			}

			const matches = await validatePassword(password, user.passwordHash)

			if (!matches) {
				throw new Error("Invalid credentials")
			}

			const token = await createToken(user.id, user.email)

			return json({ token }, 201)
		},
	)
	.post(
		"/sign-up",
		zValidator(
			"json",
			z.object({
				email: emailValidator,
				password: passwordValidator,
				firstName: firstNameValidator,
				lastName: lastNameValidator,
			}),
		),
		async ({ req, var: { repositories }, json }) => {
			const { password, email, ...body } = req.valid("json")

			try {
				const usersExists = await repositories.users.findOne({ email })

				if (usersExists) {
					throw new Error("An error occurred during signup")
				}

				const hashedPassword = await hashPassword(password)
				const user = await repositories.users.create({
					email,
					...body,
					...hashedPassword,
				})

				return json(user, 201)
			} catch (error) {
				return json(
					{
						message: error,
					},
					401,
				)
			}
		},
	)
	.post("/forgot-password")
	.post("/reset-password")
