import { accountBillingAddresses } from "@/api/routes/account/billing-addresses";
import { accountCartRouter } from "@/api/routes/account/cart";
import { accountPaymentMethods } from "@/api/routes/account/payment-methods";
import { PrivateContextVariables } from "@/api/types";
import { emailValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const accountRoute = new Hono<{ Variables: PrivateContextVariables }>()
  .route("/cart", accountCartRouter)
  .route("/billing-addresses", accountBillingAddresses)
  .route("/payment-methods", accountPaymentMethods)
  .get("/", async ({ var: { db, session }, json }) => {
    const user = await db
      .selectFrom("users")
      .where("id", "=", session.user.id)
      .selectAll()
      .executeTakeFirst();

    return json(user);
  })
  .patch(
    "/password",
    zValidator(
      "json",
      z
        .object({
          oldPassword: z.string().min(8),
          newPassword: z.string().min(8),
        })
        .refine((data) => data.newPassword !== data.oldPassword, {
          message: "New password cannot be the same as the old password",
          path: ["newPassword"],
        }),
    ),
    async ({ var: { db, session }, json, req }) => {
      const data = req.valid("json");

      await db
        .updateTable("users")
        .set({ password: data.newPassword })
        .where("id", "=", session.user.id)
        .execute();

      return json({ success: true });
    },
  )
  .patch(
    "/",
    zValidator(
      "json",
      z
        .object({
          first_name: z.string().min(1),
          last_name: z.string().min(1),
          email: emailValidator,
        })
        .partial(),
    ),
    async ({ var: { db, session }, json, req }) => {
      const data = req.valid("json");

      await db
        .updateTable("users")
        .set(data)
        .where("id", "=", session.user.id)
        .execute();

      return json({ success: true });
    },
  )
  .delete("/", async ({ var: { db, session }, json }) => {
    await db.deleteFrom("users").where("id", "=", session.user.id).execute();

    return json({ success: true });
  });
