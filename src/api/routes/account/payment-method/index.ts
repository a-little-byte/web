import { checkPermissions } from "@/api/middlewares/checkPermissions";
import { PrivateContextVariables } from "@/api/types";
import { idValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const paymentMethodValidator = z.object({
  type: z.string(),
  payment_token: z.string(),
  iv: z.string(),
  last_four: z
    .string()
    .length(4)
    .regex(/^\d{4}$/),
  expiry_month: z.number().int().min(1).max(12),
  expiry_year: z.number().int().min(2023),
  is_default: z.boolean().optional().default(false),
});

export const accountPaymentMethods = new Hono<{
  Variables: PrivateContextVariables;
}>()
  .get(
    "/",
    checkPermissions("payment_methods.read"),
    async ({ var: { db, session }, json }) => {
      const paymentMethods = await db
        .selectFrom("payment_methods")
        .where("user_id", "=", session.user.id)
        .selectAll()
        .execute();

      return json({
        success: true,
        paymentMethods,
      });
    }
  )
  .get(
    "/:id",
    checkPermissions("payment_methods.read"),
    zValidator("param", z.object({ id: idValidator })),
    async ({ var: { db, session }, req, json }) => {
      const { id } = req.valid("param");

      const paymentMethod = await db
        .selectFrom("payment_methods")
        .where("id", "=", id)
        .where("user_id", "=", session.user.id)
        .selectAll()
        .executeTakeFirst();

      if (!paymentMethod) {
        return json({ error: "Payment method not found" }, 404);
      }

      return json({
        success: true,
        paymentMethod,
      });
    }
  )
  .post(
    "/",
    checkPermissions("payment_methods.create"),
    zValidator("json", paymentMethodValidator),
    async ({ var: { db, session }, req, json }) => {
      const paymentMethodData = req.valid("json");

      if (paymentMethodData.is_default) {
        await db
          .updateTable("payment_methods")
          .set({ is_default: false })
          .where("user_id", "=", session.user.id)
          .execute();
      }

      const existingMethods = await db
        .selectFrom("payment_methods")
        .where("user_id", "=", session.user.id)
        .select(["id"])
        .execute();

      if (existingMethods.length === 0) {
        paymentMethodData.is_default = true;
      }

      const paymentMethod = await db
        .insertInto("payment_methods")
        .values({
          user_id: session.user.id,
          ...paymentMethodData,
        })
        .executeTakeFirstOrThrow();

      return json({
        success: true,
        paymentMethod,
      });
    }
  )
  .patch(
    "/:id",
    checkPermissions("payment_methods.update"),
    zValidator("param", z.object({ id: idValidator })),
    zValidator(
      "json",
      z
        .object({
          expiry_month: z.number().int().min(1).max(12).optional(),
          expiry_year: z.number().int().min(2020).optional(),
          is_default: z.boolean().optional(),
        })
        .strict()
    ),
    async ({ var: { db, session }, req, json }) => {
      const { id } = req.valid("param");
      const updateData = req.valid("json");

      const existingMethod = await db
        .selectFrom("payment_methods")
        .where("id", "=", id)
        .where("user_id", "=", session.user.id)
        .select(["id"])
        .executeTakeFirst();

      if (!existingMethod) {
        return json({ error: "Payment method not found" }, 404);
      }

      if (updateData.is_default) {
        await db
          .updateTable("payment_methods")
          .set({ is_default: false })
          .where("user_id", "=", session.user.id)
          .where("id", "!=", id)
          .execute();
      }

      await db
        .updateTable("payment_methods")
        .set(updateData)
        .where("id", "=", id)
        .where("user_id", "=", session.user.id)
        .executeTakeFirstOrThrow();

      return json({
        success: true,
      });
    }
  )
  .delete(
    "/:id",
    checkPermissions("payment_methods.delete"),
    zValidator("param", z.object({ id: idValidator })),
    async ({ var: { db, session }, req, json }) => {
      const { id } = req.valid("param");
      const methodToDelete = await db
        .selectFrom("payment_methods")
        .where("id", "=", id)
        .where("user_id", "=", session.user.id)
        .select(["id", "is_default"])
        .executeTakeFirst();

      if (!methodToDelete) {
        return json({ error: "Payment method not found" }, 404);
      }

      await db
        .deleteFrom("payment_methods")
        .where("id", "=", id)
        .where("user_id", "=", session.user.id)
        .execute();

      if (methodToDelete.is_default) {
        const remainingMethod = await db
          .selectFrom("payment_methods")
          .where("user_id", "=", session.user.id)
          .select(["id"])
          .limit(1)
          .executeTakeFirst();

        if (remainingMethod) {
          await db
            .updateTable("payment_methods")
            .set({ is_default: true })
            .where("id", "=", remainingMethod.id)
            .execute();
        }
      }

      return json({
        success: true,
        message: "Payment method deleted successfully",
      });
    }
  );
