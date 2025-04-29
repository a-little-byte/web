import { Database } from "@/db";
import { Kysely } from "kysely";


export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable("services")
    .addColumn("stripe_id", "text", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("services")
    .dropColumn("stripe_id")
    .execute();
}
