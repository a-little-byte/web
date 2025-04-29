import { Database } from "@/db";
import type { Kysely } from "kysely";

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable("payment_methods")
    .addColumn("payment_token", "text", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("payment_methods")
    .dropColumn("payment_token")
    .execute();
}
