import { Database } from '@/db';
import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable("totp_secrets")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", "uuid")
    .addColumn("secret", "text", (col) => col.notNull())
    .addColumn("enabled", "boolean")
    .execute();

  await db.schema
    .alterTable("totp_secrets")
    .addForeignKeyConstraint(
      "totp_secrets_user_id_fkey",
      ["user_id"],
      "users",
      ["id"]
    )
    .onDelete("cascade")
    .execute();

}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable("totp_secrets").execute();
}
