import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
  const deleteAllFromTable = async (tableName: string): Promise<void> => {
    await db.deleteFrom(tableName).execute();
  };

  const tables = await db
    .selectFrom("information_schema.tables")
    .select("table_name")
    .where("table_schema", "=", "public")
    .where("table_name", "not in", [
      "kysely_migration_lock",
      "kysely_migration",
    ])
    .execute();

  for (let i = tables.length - 1; i >= 0; i--) {
    const tableName = tables[i].table_name;
    if (!tableName.startsWith("_") && !tableName.startsWith("pg_")) {
      await deleteAllFromTable(tableName);
      console.log(`Cleared data from table: ${tableName}`);
    }
  }

  console.log("Database cleanup complete!");
}
