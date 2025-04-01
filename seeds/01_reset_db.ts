import { Database } from '@/db'
import type { Kysely } from 'kysely'

export async function seed(db: Kysely<Database>): Promise<void> {
  const deleteAllFromTable = async (tableName: keyof Database): Promise<void> => {
    await db.deleteFrom(tableName).execute()
  }

  const tables = await db
    .selectFrom('information_schema.tables')
    .select('table_name')
    .where('table_schema', '=', 'public') 
    .execute()

  for (let i = tables.length - 1; i >= 0; i--) {
    const tableName = tables[i].table_name
    if (!tableName.startsWith('_') && !tableName.startsWith('pg_')) {
      await deleteAllFromTable(tableName)
      console.log(`Cleared data from table: ${tableName}`)
    }
  }

  console.log('Database cleanup complete!')
}
