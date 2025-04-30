import { type Kysely } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .alterTable("users")
    .addColumn("suspended_at", "timestamptz")
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.alterTable("users").dropColumn("suspended_at").execute();
};
