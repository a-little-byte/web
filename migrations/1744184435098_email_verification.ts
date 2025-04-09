import { Database } from '@/db';
import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
   .createTable("verification")
   .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
  .addColumn("user_id", "uuid")
  .addColumn("email_token", "text", (col)=>col.notNull())
  .addColumn("email_token_time", "text", (col)=>col.notNull())
  .execute()

  await db.schema
    .alterTable("verification")
    .addForeignKeyConstraint(
      "verification_user_id_fkey",
      ["user_id"],
      "users",
      ["id"]
    )
    .onDelete("cascade")
    .execute();


  await db.schema
    .createIndex("idx_email_token")
    .on("verification")
    .column("email_token")
    .execute();

}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .dropTable("verification")
    .execute()
}
