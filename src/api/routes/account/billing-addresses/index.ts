import { PrivateContextVariables } from "@/api/types";
import { idValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const accountBillingAddresses = new Hono<{
  Variables: PrivateContextVariables;
}>()
  .get("/", async ({ var: { db, session }, json }) => {
    const billingAddress = await db
      .selectFrom("billing_addresses")
      .where("user_id", "=", session.user.id)
      .selectAll()
      .executeTakeFirst();

    return json(billingAddress);
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postal_code: z.string(),
        country: z.string(),
      })
    ),
    async ({ var: { db, session }, json, req }) => {
      const data = req.valid("json");

      const billingAddress = await db
        .insertInto("billing_addresses")
        .values({
          user_id: session.user.id,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country,
          street: data.street,
          is_default: false,
        })
        .execute();

      return json(billingAddress);
    }
  )
  .patch(
    "/:billingAddressId",
    zValidator(
      "param",
      z.object({
        billingAddressId: idValidator,
      })
    ),
    zValidator(
      "json",
      z
        .object({
          street: z.string(),
          city: z.string(),
          state: z.string(),
          postal_code: z.string(),
          country: z.string(),
        })
        .partial()
    ),
    async ({ var: { db, session, cacheService }, json, req }) => {
      const { billingAddressId } = req.valid("param");
      const data = req.valid("json");

      const billingAddress = await db
        .updateTable("billing_addresses")
        .set(data)
        .where("id", "=", billingAddressId)
        .where("user_id", "=", session.user.id)
        .executeTakeFirst();

      await cacheService.set(
        "billing_addresses",
        billingAddressId,
        billingAddress
      );

      return json(billingAddress);
    }
  )
  .delete(
    "/:billingAddressId",
    zValidator("param", z.object({ billingAddressId: idValidator })),
    async ({ var: { db, session, cacheService }, req, json }) => {
      const { billingAddressId } = req.valid("param");

      await db
        .deleteFrom("billing_addresses")
        .where("id", "=", billingAddressId)
        .where("user_id", "=", session.user.id)
        .execute();

      await cacheService.delete("billing_addresses", billingAddressId);

      return json({ success: true });
    }
  );
