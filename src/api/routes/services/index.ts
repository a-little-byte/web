import { checkPermissions } from "@/api/middlewares/checkPermissions";
import { PrivateContextVariables, PublicContextVariables } from "@/api/types";
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

export const servicesRouter = new Hono<{ Variables: PublicContextVariables }>()
  .get("/", async ({ var: { db }, json }) => {
    const services = await db
      .selectFrom("services")
      .selectAll()
      .orderBy("createdAt", "desc")
      .execute();

    return json(services);
  })
  .route(
    "/",
    new Hono<{ Variables: PrivateContextVariables }>()
      .post(
        "/",
        checkPermissions("services.create"),
        zValidator("json", serviceSchema),
        async ({ var: { db }, json, req }) => {
          const data = req.valid("json");

          const service = await db
            .insertInto("services")
            .values(data)
            .executeTakeFirstOrThrow();

          return json(service);
        },
      )
      .patch(
        "/:id",
        checkPermissions("services.update"),
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
        },
      )
      .delete(
        "/:id",
        checkPermissions("services.delete"),
        zValidator("param", z.object({ id: idValidator })),
        async ({ var: { db }, json, req }) => {
          const { id } = req.valid("param");

          const service = await db
            .deleteFrom("services")
            .where("id", "=", id)
            .executeTakeFirstOrThrow();

          return json(service);
        },
      ),
  );
