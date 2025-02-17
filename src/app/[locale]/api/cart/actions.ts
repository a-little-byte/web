"use server";

import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "../auth/actions";

export async function addToCart(serviceId: string, quantity: number = 1) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("service_id", serviceId)
      .single();

    if (existingItem) {
      const { error } = await supabase
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        service_id: serviceId,
        quantity,
      });

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { error: "Failed to add to cart" };
  }
}

export async function updateCartItem(itemId: string, quantity: number) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .eq("user_id", user.id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { error: "Failed to update cart item" };
  }
}

export async function removeFromCart(itemId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId)
      .eq("user_id", user.id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { error: "Failed to remove from cart" };
  }
}

export async function getCartItems() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const { data: items, error } = await supabase
      .from("cart_items")
      .select(
        `
        id,
        quantity,
        services (
          name,
          price,
          period
        )
      `
      )
      .eq("user_id", user.id);

    if (error) throw error;
    return { items };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return { error: "Failed to fetch cart items" };
  }
}
