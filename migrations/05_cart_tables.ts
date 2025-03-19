import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("cart_items")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", "uuid")
    .addColumn("service_id", "uuid")
    .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(1))
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .execute();

  await db.schema
    .alterTable("cart_items")
    .addForeignKeyConstraint("cart_items_user_id_fkey", ["user_id"], "users", [
      "id",
    ])
    .onDelete("cascade")
    .execute();

  await db.schema
    .alterTable("cart_items")
    .addForeignKeyConstraint(
      "cart_items_service_id_fkey",
      ["service_id"],
      "services",
      ["id"]
    )
    .onDelete("cascade")
    .execute();

  await db.schema
    .createIndex("idx_cart_items_user_id")
    .on("cart_items")
    .column("user_id")
    .execute();

  await db.schema
    .createIndex("idx_cart_items_service_id")
    .on("cart_items")
    .column("service_id")
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("cart_items").execute();
}
