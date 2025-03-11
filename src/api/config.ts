import { z } from "zod";

export const apiConfigSchema = z.object({
  stripeSecretKey: z.string(),
  resendApiKey: z.string(),
  sentryDsn: z.string().url(),
});

const configValues: z.input<typeof apiConfigSchema> = {
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  resendApiKey: process.env.RESEND_API_KEY!,
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
};

export const apiConfig = apiConfigSchema.parse(configValues);
