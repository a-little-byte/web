"use server";

import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "../auth/actions";

export async function getUserSubscriptions() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select(
        `
        id,
        status,
        current_period_start,
        current_period_end,
        services (
          name,
          price,
          period
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
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

    const { data: payments, error } = await supabase
      .from("payments")
      .select(
        `
        id,
        amount,
        status,
        payment_method,
        created_at,
        subscriptions!inner (
          services (
            name
          )
        )
      `
      )
      .eq("subscriptions.user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { payments };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return { error: "Failed to fetch payments" };
  }
}
