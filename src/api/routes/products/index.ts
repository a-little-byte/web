import { cacheQuery } from "@/api/lib/cache";
import { authMiddleware } from "@/api/middlewares/auth";
import { checkPermissions } from "@/api/middlewares/checkPermissions";
import { productCategoriesRouter } from "@/api/routes/products/categories";
import { PrivateContextVariables, PublicContextVariables } from "@/api/types";
import { idValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const productSchema = z.object({
  name: z.string(),
  price: z.number(),
  category_id: idValidator,
});

export const productsRouter = new Hono<{ Variables: PublicContextVariables }>()
  .route("/categories", productCategoriesRouter)
  .get("/", async ({ var: { db }, json }) => {
    const products = await db
      .selectFrom("products")
      .innerJoin(
        "product_categories",
        "products.category_id",
        "product_categories.id"
      )
      .select([
        "products.id",
        "products.name",
        "products.price",
        "products.category_id",
        "products.created_at",
        "products.updated_at",
        "product_categories.name as categoryName",
      ])
      .orderBy("products.created_at", "desc")
      .execute();

    return json(products);
  })
  .get(
    "/:id",
    zValidator("param", z.object({ id: idValidator })),
    async ({ var: { db, cacheService }, json, req }) => {
      const { id } = req.valid("param");

      const product = await cacheQuery(cacheService, "products", id, (id) =>
        db
          .selectFrom("products")
          .leftJoin(
            "product_categories",
            "products.category_id",
            "product_categories.id"
          )
          .select([
            "products.id",
            "products.name",
            "products.price",
            "products.category_id",
            "products.created_at",
            "products.updated_at",
            "product_categories.name as categoryName",
          ])
          .where("products.id", "=", id)
          .executeTakeFirst()
      );

      if (!product) {
        return json({ error: "Product not found" }, 404);
      }

      return json(product);
    }
  )
  .route(
    "/",
    new Hono<{ Variables: PrivateContextVariables }>()
      .use(authMiddleware)
      .post(
        "/",
        checkPermissions("products.create"),
        zValidator("json", productSchema),
        async ({ var: { db, cacheService }, json, req }) => {
          const data = req.valid("json");

          const product = await db
            .insertInto("products")
            .values(data)
            .returningAll()
            .executeTakeFirstOrThrow();

          await cacheService.set("products", product.id, product);

          return json(product);
        }
      )
      .patch(
        "/:id",
        checkPermissions("products.update"),
        zValidator("param", z.object({ id: idValidator })),
        zValidator("json", productSchema.partial()),
        async ({ var: { db, cacheService }, json, req }) => {
          const { id } = req.valid("param");
          const data = req.valid("json");

          const product = await db
            .updateTable("products")
            .set(data)
            .where("id", "=", id)
            .returningAll()
            .executeTakeFirstOrThrow();

          await cacheService.set("products", product.id, product);

          return json(product);
        }
      )
      .delete(
        "/:id",
        checkPermissions("products.delete"),
        zValidator("param", z.object({ id: idValidator })),
        async ({ var: { db, cacheService }, json, req }) => {
          const { id } = req.valid("param");

          await db
            .deleteFrom("products")
            .where("id", "=", id)
            .executeTakeFirstOrThrow();

          await cacheService.delete("products", id);

          return json({ success: true });
        }
      )
  );
