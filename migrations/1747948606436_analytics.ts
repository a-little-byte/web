import { type Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable("analytics")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("url", "text", (col) => col.notNull())
    .addColumn("method", "text", (col) => col.notNull())
    .addColumn("status_code", "integer", (col) => col.notNull())
    .addColumn("response_time", "integer", (col) => col.notNull()) // milliseconds
    .addColumn("user_agent", "text")
    .addColumn("ip_address", "text")
    .addColumn("user_id", "uuid")
    .addColumn("referer", "text")
    .addColumn("country", "text")
    .addColumn("city", "text")
    .addColumn("device_type", "text") // mobile, desktop, tablet
    .addColumn("browser", "text")
    .addColumn("os", "text")
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .execute();

  // Add foreign key constraint for user_id
  await db.schema
    .alterTable("analytics")
    .addForeignKeyConstraint("analytics_user_id_fkey", ["user_id"], "users", [
      "id",
    ])
    .onDelete("set null")
    .execute();

  // Add indexes for better query performance
  await db.schema
    .createIndex("idx_analytics_created_at")
    .on("analytics")
    .column("createdAt")
    .execute();

  await db.schema
    .createIndex("idx_analytics_url")
    .on("analytics")
    .column("url")
    .execute();

  await db.schema
    .createIndex("idx_analytics_status_code")
    .on("analytics")
    .column("status_code")
    .execute();

  await db.schema
    .createIndex("idx_analytics_method")
    .on("analytics")
    .column("method")
    .execute();

  await db.schema
    .createIndex("idx_analytics_user_id")
    .on("analytics")
    .column("user_id")
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable("analytics").execute();
};
