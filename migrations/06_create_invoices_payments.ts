import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("invoices")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("payment_id", "uuid")
    .addColumn("number", "text", (col) => col.notNull())
    .addColumn("file_url", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("payment_methods")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", "uuid")
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("last_four", "text", (col) => col.notNull())
    .addColumn("expiry_month", "integer", (col) => col.notNull())
    .addColumn("expiry_year", "integer", (col) => col.notNull())
    .addColumn("is_default", "boolean", (col) => col.defaultTo(false))
    .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("payments")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v4()`)
    )
    .addColumn("subscription_id", "uuid", (col) => col.notNull())
    .addColumn("amount", "numeric", (col) => col.notNull())
    .addColumn("status", "text", (col) => col.notNull())
    .addColumn("payment_method", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .addColumn("billing_address_id", "uuid")
    .addColumn("payment_method_id", "uuid")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("invoices").execute();
  await db.schema.dropTable("payment_methods").execute();
  await db.schema.dropTable("payments").execute();
}
