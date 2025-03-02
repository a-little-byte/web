import { z } from "zod";

export const apiConfigSchema = z.object({
  stripeSecretKey: z.string(),
  resendApiKey: z.string(),
});

const configValues = {
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
};

export const apiConfig = apiConfigSchema.parse(configValues);
