import { ContextVariables } from "@/api/types";
import { Hono } from "hono";

export const subscriptionsRouter = new Hono<{
  Variables: ContextVariables;
}>().get("/", async (c) => {
  try {
    const db = c.get("db");
    const { user } = c.get("session");

    // Fetch active subscriptions with their associated services
    const subscriptions = await db
      .selectFrom("subscriptions")
      .select(["id", "status", "current_period_start", "current_period_end"])
      .where("user_id", "=", user.id)
      .where("status", "=", "active")
      .execute();

    // Fetch services for each subscription
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
          services: services[0] || null, // Assuming one service per subscription
        };
      })
    );

    // Fetch total payments
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
      (sum, payment) => sum + Number(payment.amount),
      0
    );

    return c.json({
      subscriptions: subscriptionsWithServices,
      totalSpent,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return c.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
});
