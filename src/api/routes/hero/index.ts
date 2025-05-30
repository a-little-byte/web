import { checkPermissions } from "@/api/middlewares/checkPermissions";
import { PrivateContextVariables, PublicContextVariables } from "@/api/types";
import { idValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const heroRouter = new Hono<{ Variables: PublicContextVariables }>()
  .get("/", async ({ var: { db }, json }) => {
    const carouselItems = await db
      .selectFrom("hero_carousel")
      .selectAll()
      .where("active", "=", true)
      .orderBy("order")
      .execute();

    return json(carouselItems);
  })
  .route(
    "/",
    new Hono<{ Variables: PrivateContextVariables }>()
      .post(
        "/",
        checkPermissions("hero_carousel.create"),
        zValidator(
          "json",
          z.object({
            title: z.string(),
            description: z.string(),
            image_url: z.string(),
            button_text: z.string(),
            button_link: z.string(),
            active: z.boolean(),
            order: z.number(),
          })
        ),
        async ({ var: { db, cacheService }, req, json }) => {
          const body = req.valid("json");

          const result = await db
            .insertInto("hero_carousel")
            .values(body)
            .returningAll()
            .executeTakeFirstOrThrow();

          await cacheService.set("hero_carousel", result.id, result);

          return json(result);
        }
      )
      .patch(
        "/:id",
        checkPermissions("hero_carousel.update"),
        zValidator("param", z.object({ id: idValidator })),
        zValidator(
          "json",
          z
            .object({
              title: z.string(),
              description: z.string(),
              image_url: z.string(),
              button_text: z.string(),
              button_link: z.string(),
              active: z.boolean(),
              order: z.number(),
            })
            .partial()
        ),
        async ({ var: { db, cacheService }, req, json }) => {
          const { id } = req.valid("param");
          const body = req.valid("json");

          const result = await db
            .updateTable("hero_carousel")
            .set(body)
            .where("id", "=", id)
            .returningAll()
            .executeTakeFirstOrThrow();

          await cacheService.set("hero_carousel", id, result);

          return json(result);
        }
      )
      .delete(
        "/:id",
        checkPermissions("hero_carousel.delete"),
        zValidator("param", z.object({ id: idValidator })),
        async ({ var: { db, cacheService }, req, json }) => {
          const { id } = req.valid("param");

          await db.deleteFrom("hero_carousel").where("id", "=", id).execute();

          await cacheService.delete("hero_carousel", id);

          return json({});
        }
      )
  );
