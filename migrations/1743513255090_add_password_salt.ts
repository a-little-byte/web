import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
     .alterTable("users")
     .addColumn("password_salt", "text", (col) => col.notNull())
     .execute()
}


