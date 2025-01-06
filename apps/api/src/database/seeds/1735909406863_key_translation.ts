import { Database, NewTranslation } from "@alittlebyte/api/database/types"
import { faker } from "@faker-js/faker"
import type { Kysely } from "kysely"

const generateTranslation = (
	key: string,
	type: "description" | "technical",
): NewTranslation => ({
	key,
	languageCode: "en",
	content:
		type === "description"
			? faker.commerce.productDescription()
			: `${faker.commerce.productMaterial()}<br/>${faker.commerce.productDescription()}<br/>${faker.commerce.productAdjective()}`,
})

export const seed = async (db: Kysely<Database>) => {
	const findServices = await db.selectFrom("services").selectAll().execute()
	const translations: NewTranslation[] = findServices.flatMap((service) => [
		generateTranslation(service.descriptionKey, "description"),
		generateTranslation(service.technicalSpecificationsKey, "technical"),
	])

	await db.insertInto("translations").values(translations).execute()
}
