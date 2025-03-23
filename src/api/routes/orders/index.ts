import { checkPermissions } from "@/api/middlewares/checkPermissions";
import { PrivateContextVariables } from "@/api/types";
import { Hono } from "hono";

export const ordersRouter = new Hono<{
  Variables: PrivateContextVariables;
}>().get(
  "/",
  checkPermissions("orders.read"),
  async ({
    var: {
      db,
      session: { user },
    },
    json,
  }) => {
    const payments = await db
      .selectFrom("payments")
      .select([
        "payments.id",
        "payments.amount",
        "payments.status",
        "payments.createdAt",
        "payments.billing_address_id",
        "payments.payment_method_id",
      ])
      .innerJoin(
        "subscriptions",
        "subscriptions.id",
        "payments.subscription_id"
      )
      .where("subscriptions.user_id", "=", user.id)
      .orderBy("payments.createdAt", "desc")
      .execute();

    const ordersWithDetails = await Promise.all(
      payments.map(async (payment) => {
        const subscription = await db
          .selectFrom("subscriptions")
          .select("service_id")
          .where("id", "=", payment.id)
          .executeTakeFirst();

        const service = subscription
          ? await db
              .selectFrom("services")
              .select(["name"])
              .where("id", "=", subscription.service_id)
              .executeTakeFirst()
          : undefined;

        const billingAddress = payment.billing_address_id
          ? await db
              .selectFrom("billing_addresses")
              .select(["street", "city", "state", "postal_code", "country"])
              .where("id", "=", payment.billing_address_id)
              .executeTakeFirst()
          : undefined;

        const paymentMethod = payment.payment_method_id
          ? await db
              .selectFrom("payment_methods")
              .select(["type", "last_four"])
              .where("id", "=", payment.payment_method_id)
              .executeTakeFirst()
          : undefined;

        const invoice = await db
          .selectFrom("invoices")
          .select(["number", "file_url"])
          .where("payment_id", "=", payment.id)
          .executeTakeFirst();

        return {
          id: payment.id,
          service_name: service?.name || "Unknown Service",
          amount: payment.amount,
          status: payment.status,
          createdAt: payment.createdAt,
          subscription_period: "monthly",
          payment_method: paymentMethod,
          billing_address: billingAddress,
          invoice: invoice || undefined,
        };
      })
    );

    return json(ordersWithDetails);
  }
);
