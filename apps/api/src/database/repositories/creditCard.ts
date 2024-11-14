import { db } from "@alittlebyte/api/database"
import {
	CreditCardUpdate,
	NewCreditCard,
	User,
} from "@alittlebyte/api/database/types"
import { UUID } from "node:crypto"

const findAll = async (criteria: Partial<User>) => {
	let query = db.selectFrom("creditCards")

	if (criteria.id) {
		query = query.where("id", "=", criteria.id)
	}

	if (criteria.createdAt) {
		query = query.where("createdAt", "=", criteria.createdAt)
	}

	return await query.selectAll().execute()
}
const findById = (id: UUID) =>
	db
		.selectFrom("creditCards")
		.where("id", "=", id)
		.selectAll()
		.executeTakeFirst()
const create = (creditCard: NewCreditCard) =>
	db
		.insertInto("creditCards")
		.values(creditCard)
		.returningAll()
		.executeTakeFirstOrThrow()
const deleteUser = (id: UUID) =>
	db
		.deleteFrom("creditCards")
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirst()
const updateReturn = (id: UUID, updateWith: CreditCardUpdate) =>
	db
		.updateTable("creditCards")
		.set(updateWith)
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirst()
const update = async (id: UUID, updateWith: CreditCardUpdate) => {
	await db
		.updateTable("creditCards")
		.set(updateWith)
		.where("id", "=", id)
		.execute()
}

export const creditCardsRepository = {
	findAll,
	findById,
	create,
	update,
	updateReturn,
	delete: deleteUser,
} as const
