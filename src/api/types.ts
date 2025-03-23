import type { Database } from "@/db";
import type { UserSelect } from "@/db/models/User";
import type { Enforcer } from "casbin";
import type { Kysely } from "kysely";
import type { Resend } from "resend";
import type Stripe from "stripe";

export type PublicContextVariables = {
  db: Kysely<Database>;
  resend: Resend;
  stripe: Stripe;
};

export type PrivateContextVariables = PublicContextVariables & {
  enforcer: Enforcer;
  session: {
    user: UserSelect;
  };
};
