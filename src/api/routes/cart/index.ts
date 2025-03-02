import { ContextVariables } from "@/api/types";
import { Hono } from "hono";

export const cartRouter = new Hono<{ Variables: ContextVariables }>().get(
  "/",
  async ({ var: { db }, json }) => {
    const cart = await db
      .selectFrom("cart_items")
      .selectAll()
      .where("user_id", "=", session.user.id)
      .execute();
    return json(cart);
  }
);
