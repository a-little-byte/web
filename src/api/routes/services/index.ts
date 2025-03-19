import { ContextVariables } from "@/api/types";
import { idValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  period: z.string(),
});

export const servicesRouter = new Hono<{ Variables: ContextVariables }>()
  .get("/", async ({ var: { db }, json }) => {
    const services = await db
      .selectFrom("services")
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();

    return json(services);
  })
  .post(
    "/",
    zValidator("json", serviceSchema),
    async ({ var: { db }, json, req }) => {
      const data = req.valid("json");

      const service = await db
        .insertInto("services")
        .values(data)
        .executeTakeFirstOrThrow();

      return json(service);
    }
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: idValidator })),
    zValidator("json", serviceSchema.partial()),
    async ({ var: { db }, json, req }) => {
      const { id } = req.valid("param");
      const data = req.valid("json");

      const service = await db
        .updateTable("services")
        .set(data)
        .where("id", "=", id)
        .executeTakeFirstOrThrow();

      return json(service);
    }
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: idValidator })),
    async ({ var: { db }, json, req }) => {
      const { id } = req.valid("param");

      const service = await db
        .deleteFrom("services")
        .where("id", "=", id)
        .executeTakeFirstOrThrow();

      return json(service);
    }
  );
