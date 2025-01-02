import type { Database } from "@alittlebyte/api/database/types"
import { baseTable } from "@alittlebyte/api/database/utils/baseTable"
import { notNullColumn } from "@alittlebyte/api/database/utils/notNullColumn"
import { Kysely } from "kysely"
import { serviceTranslationColumn } from "../utils/serviceTranslation"

export const up = async (db: Kysely<Database>): Promise<void> => {
	await db.schema
		.createTable("translations")
		.$call(baseTable)
		.$call(serviceTranslationColumn)
		.$call(notNullColumn("key"))
		.$call(notNullColumn("languageCode"))
		.$call(notNullColumn("content", "text"))
		.execute()
}

export const down = async (db: Kysely<Database>): Promise<void> => {
	await db.schema.dropTable("translations").execute()
}
