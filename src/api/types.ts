import type { Database } from "@/db";
import type { User } from "@/db/models";
import type { Kysely } from "kysely";
import type { Resend } from "resend";
import type Stripe from "stripe";

export type ContextVariables = {
  db: Kysely<Database>;
  resend: Resend;
  stripe: Stripe;
  session: {
    user: User;
  };
};
