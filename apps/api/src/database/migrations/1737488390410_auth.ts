import { Database } from "@alittlebyte/api/database/types"
import { baseTable } from "@alittlebyte/api/database/utils/baseTable"
import { notNullColumn } from "@alittlebyte/api/database/utils/notNullColumn"
import type { Kysely } from "kysely"

export const up = async (db: Kysely<Database>): Promise<void> => {
	await db.schema
		.createTable("users")
		.$call(baseTable)
		.$call(notNullColumn("firstName"))
		.$call(notNullColumn("lastName"))
		.addColumn("email", "text", (col) => col.notNull().unique())
		.$call(notNullColumn("passwordHash"))
		.$call(notNullColumn("passwordSalt"))
		.addColumn("emailVerifiedAt", "timestamptz")
		.execute()
}

export const down = async (db: Kysely<Database>): Promise<void> => {
	await db.schema.dropTable("users").execute()
}
