import { PrivateContextVariables } from "@/api/types";
import { idValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const accountPaymentMethods = new Hono<{
  Variables: PrivateContextVariables;
}>()
  .get("/", async ({ var: { db, session }, json }) => {
    const paymentMethods = await db
      .selectFrom("payment_methods")
      .where("user_id", "=", session.user.id)
      .selectAll()
      .executeTakeFirst();

    return json(paymentMethods);
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        expiry_month: z.number(),
        expiry_year: z.number(),
        last_four: z.string(),
        type: z.string(),
        is_default: z.boolean(),
      })
    ),
    async ({ var: { db, session }, json, req }) => {
      const data = req.valid("json");

      const paymentMethod = await db
        .insertInto("payment_methods")
        .values({
          user_id: session.user.id,
          expiry_month: data.expiry_month,
          expiry_year: data.expiry_year,
          last_four: data.last_four,
          type: data.type,
          is_default: data.is_default,
        })
        .execute();

      return json(paymentMethod);
    }
  )
  .patch(
    "/:paymentMethodId",
    zValidator(
      "param",
      z.object({
        paymentMethodId: idValidator,
      })
    ),
    zValidator(
      "json",
      z
        .object({
          expiry_month: z.number(),
          expiry_year: z.number(),
          last_four: z.string(),
          type: z.string(),
          is_default: z.boolean(),
        })
        .partial()
    ),
    async ({ var: { db, session }, json, req }) => {
      const { paymentMethodId } = req.valid("param");
      const data = req.valid("json");

      const paymentMethod = await db
        .updateTable("payment_methods")
        .set(data)
        .where("id", "=", paymentMethodId)
        .where("user_id", "=", session.user.id)
        .executeTakeFirst();

      return json(paymentMethod);
    }
  )
  .delete(
    "/:paymentMethodId",
    zValidator("param", z.object({ paymentMethodId: idValidator })),
    async ({ var: { db, session }, req, json }) => {
      const { paymentMethodId } = req.valid("param");

      await db
        .deleteFrom("payment_methods")
        .where("id", "=", paymentMethodId)
        .where("user_id", "=", session.user.id)
        .execute();

      return json({ success: true });
    }
  );
