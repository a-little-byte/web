import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("cart_items")
    .addColumn("duration", "text", (col) => col.notNull().defaultTo("1"))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("cart_items").dropColumn("duration").execute();
}
