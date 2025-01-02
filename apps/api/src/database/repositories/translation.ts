import { db } from "@alittlebyte/api/database"
import {
	NewTranslation,
	TranslationUpdate,
} from "@alittlebyte/api/database/types"

const translationFindById = (key: string) =>
	db
		.selectFrom("translations")
		.where("key", "=", key)
		.selectAll()
		.executeTakeFirst()
const translationCreate = (translation: NewTranslation) =>
	db
		.insertInto("translations")
		.values(translation)
		.returningAll()
		.executeTakeFirstOrThrow()
const translationUpdateReturn = (key: string, updateWith: TranslationUpdate) =>
	db
		.updateTable("translations")
		.set(updateWith)
		.where("key", "=", key)
		.returningAll()
		.executeTakeFirst()
const translationUpdate = async (
	key: string,
	updateWith: TranslationUpdate,
) => {
	await db
		.updateTable("translations")
		.set(updateWith)
		.where("key", "=", key)
		.execute()
}

export const translationRepository = {
	findByKey: translationFindById,
	create: translationCreate,
	updateReturn: translationUpdateReturn,
	update: translationUpdate,
} as const
