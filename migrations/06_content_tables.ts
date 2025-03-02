import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("hero_carousel")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("image_url", "text", (col) => col.notNull())
    .addColumn("button_text", "text")
    .addColumn("button_link", "text")
    .addColumn("order", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("active", "boolean", (col) => col.notNull().defaultTo(true))
    .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex("idx_hero_carousel_order")
    .on("hero_carousel")
    .column("order")
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("hero_carousel").execute();
}
