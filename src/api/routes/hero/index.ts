import { db } from "@/db";
import { Hono } from "hono";

export const heroRouter = new Hono().get("/", async (c) => {
  try {
    const carouselItems = await db
      .selectFrom("hero_carousel")
      .selectAll()
      .where("active", "=", true)
      .orderBy("order")
      .execute();

    return c.json(carouselItems);
  } catch (error) {
    console.error("Error fetching hero carousel items:", error);
    return c.json({ error: "Failed to fetch carousel items" }, 500);
  }
});
