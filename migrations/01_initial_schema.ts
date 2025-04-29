import { type Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable("services")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("name", "text", (col) => col.notNull().unique())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("price", "numeric", (col) => col.notNull())
    .addColumn("period", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("users")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("password", "text", (col) => col.notNull())
    .addColumn("first_name", "text", (col) => col.notNull())
    .addColumn("last_name", "text", (col) => col.notNull())
    .addColumn("role", "text", (col) => col.defaultTo("user"))
    .addColumn("email_verified", "timestamptz")
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("subscriptions")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", "uuid", (col) => col.notNull())
    .addColumn("service_id", "uuid", (col) => col.notNull())
    .addColumn("status", "text", (col) => col.notNull().defaultTo("active"))
    .addColumn("current_period_start", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("current_period_end", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .execute();

  // Add foreign key constraints
  await db.schema
    .alterTable("subscriptions")
    .addForeignKeyConstraint(
      "subscriptions_user_id_fkey",
      ["user_id"],
      "users",
      ["id"]
    )
    .onDelete("cascade")
    .execute();

  await db.schema
    .alterTable("subscriptions")
    .addForeignKeyConstraint(
      "subscriptions_service_id_fkey",
      ["service_id"],
      "services",
      ["id"]
    )
    .onDelete("cascade")
    .execute();

  await db.schema
    .createIndex("idx_subscriptions_user_id")
    .on("subscriptions")
    .column("user_id")
    .execute();

  await db.schema
    .createIndex("idx_subscriptions_service_id")
    .on("subscriptions")
    .column("service_id")
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable("services").execute();
  await db.schema.dropTable("subscriptions").execute();
  await db.schema.dropTable("users").execute();
};
