import { Database } from "@/db";
import { sql, type Kysely } from "kysely";

export const up = async (db: Kysely<Database>): Promise<void> => {
  await db.schema
    .createTable("login_attempts")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("ip_address", "text", (col) => col.notNull())
    .addColumn("attempted_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`)
    )
    .addColumn("is_locked", "boolean", (col) => col.defaultTo(false))
    .addColumn("lock_expires_at", "timestamp")
    .execute();
};

export const down = async (db: Kysely<Database>): Promise<void> => {
  await db.schema.dropTable("login_attempts").execute();
};
