import { baseTable } from "@alittlebyte/api/database/baseTable"
import { notNullColumn } from "@alittlebyte/api/database/notNullColumn"
import type { Database } from "@alittlebyte/api/database/types"
import { Kysely } from "kysely"

export const up = async (db: Kysely<Database>): Promise<void> => {
	await db.schema
		.createTable("services")
		.$call(baseTable)
		.$call(notNullColumn("name"))
		.$call(notNullColumn("descriptionKey"))
		.$call(notNullColumn("technicalSpecificationsKey"))
		.$call(notNullColumn("price", "float8"))
		.$call(notNullColumn("perUser", "boolean"))
		.$call(notNullColumn("perDevice", "boolean"))
		.$call(notNullColumn("available", "boolean"))
		.execute()
}

export const down = async (db: Kysely<Database>): Promise<void> => {
	await db.schema.dropTable("services").execute()
}
