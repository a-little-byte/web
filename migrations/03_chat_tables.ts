import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("chat_conversations")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", "uuid")
    .addColumn("title", "text")
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("chat_messages")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("conversation_id", "uuid")
    .addColumn("role", "text", (col) => col.notNull())
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`now()`))
    .execute();

  await db.schema
    .alterTable("chat_messages")
    .addForeignKeyConstraint(
      "chat_messages_conversation_id_fkey",
      ["conversation_id"],
      "chat_conversations",
      ["id"]
    )
    .onDelete("cascade")
    .execute();

  await db.schema
    .createIndex("idx_chat_conversations_user_id")
    .on("chat_conversations")
    .column("user_id")
    .execute();

  await db.schema
    .createIndex("idx_chat_messages_conversation_id")
    .on("chat_messages")
    .column("conversation_id")
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("chat_messages").execute();
  await db.schema.dropTable("chat_conversations").execute();
}
