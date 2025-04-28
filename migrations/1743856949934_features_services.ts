import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .alterTable("services")
    .addColumn("features", "jsonb", (col) => col.notNull())
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.alterTable("services").dropColumn("features").execute();
};
