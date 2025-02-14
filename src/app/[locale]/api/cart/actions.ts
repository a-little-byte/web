"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "../auth/actions";

export async function addToCart(serviceId: string, quantity: number = 1) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    // Check if item already exists in cart
    const existingItem = await db
      .selectFrom("cart_items")
      .where("user_id", "=", user.id)
      .where("service_id", "=", serviceId)
      .selectAll()
      .executeTakeFirst();

    if (existingItem) {
      // Update quantity
      await db
        .updateTable("cart_items")
        .set({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date(),
        })
        .where("id", "=", existingItem.id)
        .execute();
    } else {
      // Add new item
      await db
        .insertInto("cart_items")
        .values({
          user_id: user.id,
          service_id: serviceId,
          quantity,
        })
        .execute();
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

    await db
      .updateTable("cart_items")
      .set({
        quantity,
        updated_at: new Date(),
      })
      .where("id", "=", itemId)
      .where("user_id", "=", user.id)
      .execute();

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

    await db
      .deleteFrom("cart_items")
      .where("id", "=", itemId)
      .where("user_id", "=", user.id)
      .execute();

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

    const items = await db
      .selectFrom("cart_items")
      .innerJoin("services", "services.id", "cart_items.service_id")
      .where("cart_items.user_id", "=", user.id)
      .select([
        "cart_items.id",
        "cart_items.quantity",
        "services.name",
        "services.price",
        "services.period",
      ])
      .execute();

    return { items };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return { error: "Failed to fetch cart items" };
  }
}
