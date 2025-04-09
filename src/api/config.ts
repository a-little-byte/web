import { z } from "zod";

export const apiConfigSchema = z.object({
  stripeSecretKey: z.string(),
  resendApiKey: z.string(),
  sentryDsn: z.string().url(),
  pepper: z.string(),
  cookie: z.string(),
});

const configValues: z.input<typeof apiConfigSchema> = {
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  resendApiKey: process.env.RESEND_API_KEY!,
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
  pepper: process.env.HASH_PEPPER!,
  cookie: process.env.COOKIE_VALUE!,
};

export const apiConfig = apiConfigSchema.parse(configValues);
