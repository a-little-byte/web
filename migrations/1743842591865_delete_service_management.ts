import type { Database } from "@/db";
import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<Database>): Promise<void> => {
  await db.schema.dropTable("service_management").execute();
};

export const down = async (db: Kysely<Database>): Promise<void> => {
  await db.schema
    .createTable("service_management")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("price", "numeric", (col) => col.notNull())
    .addColumn("period", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .execute();
};
