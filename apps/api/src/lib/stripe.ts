import { apiConfig } from "@alittlebyte/api/config"
import { Stripe } from "stripe"

export const stripe = new Stripe(apiConfig.services.stripe.secretKey, {
	telemetry: false,
})
