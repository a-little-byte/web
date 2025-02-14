"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "../auth/actions";

export async function getUserSubscriptions() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const subscriptions = await db
      .selectFrom("subscriptions")
      .innerJoin("services", "services.id", "subscriptions.service_id")
      .where("subscriptions.user_id", "=", user.id)
      .select([
        "subscriptions.id",
        "subscriptions.status",
        "subscriptions.current_period_start",
        "subscriptions.current_period_end",
        "services.name as service_name",
        "services.price as service_price",
        "services.period as service_period",
      ])
      .execute();

    return { subscriptions };
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return { error: "Failed to fetch subscriptions" };
  }
}

export async function getUserPayments() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const payments = await db
      .selectFrom("payments")
      .innerJoin(
        "subscriptions",
        "subscriptions.id",
        "payments.subscription_id"
      )
      .innerJoin("services", "services.id", "subscriptions.service_id")
      .where("subscriptions.user_id", "=", user.id)
      .select([
        "payments.id",
        "payments.amount",
        "payments.status",
        "payments.payment_method",
        "payments.created_at",
        "services.name as service_name",
      ])
      .orderBy("payments.created_at", "desc")
      .execute();

    return { payments };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return { error: "Failed to fetch payments" };
  }
}
