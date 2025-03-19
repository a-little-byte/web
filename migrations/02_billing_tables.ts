import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("billing_addresses")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", "uuid")
    .addColumn("street", "text", (col) => col.notNull())
    .addColumn("city", "text", (col) => col.notNull())
    .addColumn("state", "text", (col) => col.notNull())
    .addColumn("postal_code", "text", (col) => col.notNull())
    .addColumn("country", "text", (col) => col.notNull())
    .addColumn("is_default", "boolean", (col) => col.defaultTo(false))
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .execute();

  await db.schema
    .alterTable("billing_addresses")
    .addForeignKeyConstraint(
      "billing_addresses_user_id_fkey",
      ["user_id"],
      "users",
      ["id"]
    )
    .onDelete("cascade")
    .execute();

  await db.schema
    .createIndex("idx_billing_addresses_user_id")
    .on("billing_addresses")
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("billing_addresses").execute();
}
