import { apiConfig } from "@alittlebyte/api/config"
import { stripe } from "@alittlebyte/api/lib/stripe"
import { PrivateContextVariables } from "@alittlebyte/api/utils/types"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

export const checkoutRouter = new Hono<{ Variables: PrivateContextVariables }>()
	.get(
		"/",
		zValidator("query", z.object({ sessionId: z.string() })),
		async ({ req, json }) => {
			const { sessionId } = req.valid("query")
			const session = await stripe.checkout.sessions.retrieve(sessionId)

			return json({
				status: session.status,
				// eslint-disable-next-line camelcase
				payment_status: session.payment_status,
				// eslint-disable-next-line camelcase
				customer_email: session.customer_details?.email,
			})
		},
	)
	.post("/", async ({ json, var: { user } }) => {
		const customer = await stripe.customers.search({
			query: user.email,
		})
		const session = await stripe.checkout.sessions.create({
			// eslint-disable-next-line camelcase
			line_items: [
				{
					// eslint-disable-next-line camelcase
					price_data: {
						currency: "usd",
						// eslint-disable-next-line camelcase
						product_data: {
							name: "T-shirt",
						},
						// eslint-disable-next-line camelcase
						unit_amount: 2000,
					},
					quantity: 1,
				},
			],
			customer: customer.data[0].id,
			mode: "payment",
			// eslint-disable-next-line camelcase
			ui_mode: "embedded",
			// eslint-disable-next-line camelcase
			return_url: `${apiConfig.landing.url}/checkout/return?sessionId={CHECKOUT_SESSION_ID}`,
		})

		if (!session.client_secret) {
			return json({ error: "Something went wrong" })
		}

		return json({ clientSecret: session.client_secret })
	})
