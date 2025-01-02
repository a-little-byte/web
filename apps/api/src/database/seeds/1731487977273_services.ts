import {
	Database,
	NewService,
	NewTranslation,
} from "@alittlebyte/api/database/types"
import { faker } from "@faker-js/faker"
import type { Kysely } from "kysely"
import { UUID } from "node:crypto"

const MAX_ITER = 5
const generateService = (): NewService => ({
	name: faker.commerce.productName(),
	descriptionKey: faker.string.uuid(),
	technicalSpecificationsKey: faker.string.uuid(),
	price: parseInt(faker.commerce.price(), 10),
	perUser: faker.datatype.boolean(),
	perDevice: faker.datatype.boolean(),
	available: faker.datatype.boolean(),
})
const generateTranslation = (
	key: string,
	type: "description" | "technical",
	serviceId: UUID,
): NewTranslation => ({
	key,
	languageCode: "en",
	content:
		type === "description"
			? faker.commerce.productDescription()
			: `${faker.commerce.productMaterial()}<br/>${faker.commerce.productDescription()}<br/>${faker.commerce.productAdjective()}`,
	serviceId,
})

export const seed = async (db: Kysely<Database>) => {
	const services = Array.from({ length: MAX_ITER }, () => generateService())
	const createdServices = await db
		.insertInto("services")
		.values(services)
		.returningAll()
		.execute()
	const translations: NewTranslation[] = createdServices.flatMap((service) => [
		generateTranslation(service.descriptionKey, "description", service.id),
		generateTranslation(
			service.technicalSpecificationsKey,
			"technical",
			service.id,
		),
	])

	await db.insertInto("translations").values(translations).execute()
}
