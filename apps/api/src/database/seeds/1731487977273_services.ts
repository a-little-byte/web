import { Database, NewService } from "@alittlebyte/api/database/types"
import { faker } from "@faker-js/faker"
import type { Kysely } from "kysely"

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

export const seed = async (db: Kysely<Database>) => {
	await db
		.insertInto("services")
		.values(Array.from({ length: MAX_ITER }, () => generateService()))
		.returningAll()
		.execute()
}
