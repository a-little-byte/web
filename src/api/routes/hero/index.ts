import { ContextVariables } from "@/api/types";
import { Hono } from "hono";

export const heroRouter = new Hono<{ Variables: ContextVariables }>().get(
  "/",
  async ({ var: { db }, json }) => {
    const carouselItems = await db
      .selectFrom("hero_carousel")
      .selectAll()
      .where("active", "=", true)
      .orderBy("order")
      .execute();

    return json(carouselItems);
  }
);
