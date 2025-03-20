import { adminMiddleware } from "@/api/middlewares";
import { ContextVariables } from "@/api/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { z } from "zod";

export const paymentsRouter = new Hono<{ Variables: ContextVariables }>()
  .use(adminMiddleware)
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      })
    ),
    async ({ var: { db }, json, req }) => {
      const { startDate, endDate } = req.valid("query");
      const payments = await db
        .selectFrom("payments")
        .selectAll()
        .where("createdAt", ">=", new Date(startDate))
        .where("createdAt", "<=", new Date(endDate))
        .select((eb) =>
          jsonObjectFrom(
            eb
              .selectFrom("subscriptions")
              .selectAll(["subscriptions"])
              .select((eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("services")
                    .selectAll(["services"])
                    .whereRef("services.id", "=", "subscriptions.service_id")
                ).as("service")
              )
              .whereRef("subscriptions.id", "=", "payments.subscription_id")
          ).as("subscription")
        )
        .execute();

      return json(payments);
    }
  );
