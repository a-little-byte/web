import { checkPermissions } from "@/api/middlewares/checkPermissions";
import { PrivateContextVariables } from "@/api/types";
import { Hono } from "hono";

export const subscriptionsRouter = new Hono<{
  Variables: PrivateContextVariables;
}>().get(
  "/",
  checkPermissions("subscriptions.read"),
  async ({
    var: {
      db,
      session: { user },
    },
    json,
  }) => {
    const subscriptions = await db
      .selectFrom("subscriptions")
      .select(["id", "status", "current_period_start", "current_period_end"])
      .where("user_id", "=", user.id)
      .where("status", "=", "active")
      .execute();

    const subscriptionsWithServices = await Promise.all(
      subscriptions.map(async (subscription) => {
        const services = await db
          .selectFrom("services")
          .select(["name", "price", "period"])
          .innerJoin("subscriptions", "subscriptions.service_id", "services.id")
          .where("subscriptions.id", "=", subscription.id)
          .execute();

        return {
          ...subscription,
          services: services[0] || null,
        };
      })
    );

    const payments = await db
      .selectFrom("payments")
      .select("amount")
      .innerJoin(
        "subscriptions",
        "subscriptions.id",
        "payments.subscription_id"
      )
      .where("subscriptions.user_id", "=", user.id)
      .execute();

    const totalSpent = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    return json({
      subscriptions: subscriptionsWithServices,
      totalSpent,
    });
  }
);
