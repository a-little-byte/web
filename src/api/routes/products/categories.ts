import { authMiddleware } from "@/api/middlewares/auth";
import { checkPermissions } from "@/api/middlewares/checkPermissions";
import { PrivateContextVariables, PublicContextVariables } from "@/api/types";
import { idValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string(),
});

export const productCategoriesRouter = new Hono<{
  Variables: PublicContextVariables;
}>()
  .get("/", async ({ var: { db }, json }) => {
    const categories = await db
      .selectFrom("product_categories")
      .selectAll()
      .orderBy("name", "asc")
      .execute();

    return json(categories);
  })
  .get(
    "/:id",
    zValidator("param", z.object({ id: idValidator })),
    async ({ var: { db }, json, req }) => {
      const { id } = req.valid("param");

      const category = await db
        .selectFrom("product_categories")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();

      if (!category) {
        return json({ error: "Category not found" }, 404);
      }

      return json(category);
    }
  )
  .route(
    "/",
    new Hono<{ Variables: PrivateContextVariables }>()
      .use(authMiddleware)
      .post(
        "/",
        checkPermissions("products.create"),
        zValidator("json", categorySchema),
        async ({ var: { db }, json, req }) => {
          const data = req.valid("json");

          const category = await db
            .insertInto("product_categories")
            .values(data)
            .returningAll()
            .executeTakeFirstOrThrow();

          return json(category);
        }
      )
      .patch(
        "/:id",
        checkPermissions("products.update"),
        zValidator("param", z.object({ id: idValidator })),
        zValidator("json", categorySchema.partial()),
        async ({ var: { db }, json, req }) => {
          const { id } = req.valid("param");
          const data = req.valid("json");

          const category = await db
            .updateTable("product_categories")
            .set(data)
            .where("id", "=", id)
            .returningAll()
            .executeTakeFirstOrThrow();

          return json(category);
        }
      )
      .delete(
        "/:id",
        checkPermissions("products.delete"),
        zValidator("param", z.object({ id: idValidator })),
        async ({ var: { db }, json, req }) => {
          const { id } = req.valid("param");

          await db
            .deleteFrom("product_categories")
            .where("id", "=", id)
            .executeTakeFirstOrThrow();

          return json({ success: true });
        }
      )
  );
