import { ContextVariables } from "@/api/types";
import { Hono } from "hono";

export const heroRouter = new Hono<{ Variables: ContextVariables }>().get(
  "/",
  async ({ var: { db }, json }) => {
    try {
      const carouselItems = await db
        .selectFrom("hero_carousel")
        .selectAll()
        .where("active", "=", true)
        .orderBy("order")
        .execute();

      return json(carouselItems);
    } catch (error) {
      console.error("Error fetching hero carousel items:", error);
      return json({ error: "Failed to fetch carousel items" }, 500);
    }
  }
);
