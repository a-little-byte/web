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
        name: "Diagnostic Cyber",
        price: 4500,
        category_id: prevention.id,
      },
      {
        name: "Test d'intrusion",
        price: 4000,
        category_id: prevention.id,
      },
      {
        name: "Micro SOC",
        price: 5000,
        category_id: protection.id,
      },
      {
        name: "SOC Managé",
        price: 7000,
        category_id: protection.id,
      },
      {
        name: "Investigation, éradication, remédiation",
        price: 8500,
        category_id: response.id,
      },
    ])
    .execute();
}
