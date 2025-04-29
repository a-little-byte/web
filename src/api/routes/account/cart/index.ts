import { PrivateContextVariables } from "@/api/types";
import { idValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const addToCartSchema = z.object({
  serviceId: idValidator,
  quantity: z.number().int().positive().default(1),
  duration: z.string(),
});

export const accountCartRouter = new Hono<{
  Variables: PrivateContextVariables;
}>()
  .get("/", async ({ var: { db, session }, json }) => {
    const cart = await db
    .selectFrom("cart_items")
    .innerJoin("services", "cart_items.service_id", "services.id")
    .select([
      "cart_items.id",
      "cart_items.user_id",
      "cart_items.service_id",
      "cart_items.quantity",
      "services.name as services_name",
      "services.price as services_price",
      "cart_items.createdAt",
      "cart_items.updatedAt"
    ])
    .where("cart_items.user_id", "=", session.user.id)
    .execute();

  return json(cart);
  
  })
  .post(
    "/",
    zValidator("json", addToCartSchema),
    async ({ var: { db, session }, json, req }) => {
      const { serviceId, quantity, duration } = req.valid("json");

      const service = await db
        .selectFrom("services")
        .where("id", "=", serviceId)
        .selectAll()
        .executeTakeFirstOrThrow();

      await db
        .insertInto("cart_items")
        .values({
          user_id: session.user.id,
          service_id: service.id,
          quantity,
          duration,
        })
        .execute();

      return json({
        success: true,
        message: "Item added to cart successfully",
      });
    },
  )
  .patch(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: idValidator,
      }),
    ),
    zValidator("json", z.object({ quantity: z.number().int().positive() })),
    async ({ var: { db }, json, req }) => {
      const { id } = req.valid("param");
      const { quantity } = req.valid("json");

      await db
        .updateTable("cart_items")
        .set({ quantity })
        .where("id", "=", id)
        .execute();

      return json({
        success: true,
        message: "Item updated in cart successfully",
      });
    },
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: idValidator })),
    async ({ var: { db }, json, req }) => {
      const { id } = req.valid("param");

      await db.deleteFrom("cart_items").where("id", "=", id).execute();

      return json({
        success: true,
        message: "Item removed from cart successfully",
      });
    },
  );
