import type { Database } from "@/db";
import type { Kysely } from "kysely";

export async function seed(db: Kysely<Database>): Promise<void> {
  const [prevention, protection, response] = await db
    .insertInto("product_categories")
    .values([
      {
        name: "prevention",
      },
      {
        name: "protection",
      },
      {
        name: "response",
      },
    ])
    .returningAll()
    .execute();

  await db
    .insertInto("products")
    .values([
      {
        name: "diagcyber",
        price: 4500,
        category_id: prevention.id,
      },
    ])
    .execute();
}
