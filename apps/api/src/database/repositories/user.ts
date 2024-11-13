import { db } from "@alittlebyte/api/database"
import { NewUser, User, UserUpdate } from "@alittlebyte/api/database/types"
import { UUID } from "node:crypto"

const findAll = async (criteria: Partial<User>) => {
	let query = db.selectFrom("users")

	if (criteria.id) {
		query = query.where("id", "=", criteria.id)
	}

	if (criteria.firstName) {
		query = query.where("firstName", "=", criteria.firstName)
	}

	if (criteria.lastName) {
		query = query.where("lastName", "=", criteria.lastName)
	}

	if (criteria.createdAt) {
		query = query.where("createdAt", "=", criteria.createdAt)
	}

	return await query.selectAll().execute()
}
const findById = (id: UUID) =>
	db.selectFrom("users").where("id", "=", id).selectAll().executeTakeFirst()
const create = (user: NewUser) =>
	db.insertInto("users").values(user).returningAll().executeTakeFirstOrThrow()
const deleteUser = (id: UUID) =>
	db.deleteFrom("users").where("id", "=", id).returningAll().executeTakeFirst()
const updateReturn = (id: UUID, updateWith: UserUpdate) =>
	db
		.updateTable("users")
		.set(updateWith)
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirst()
const update = async (id: UUID, updateWith: UserUpdate) => {
	await db.updateTable("users").set(updateWith).where("id", "=", id).execute()
}

export const usersRepository = {
	findAll,
	findById,
	create,
	update,
	updateReturn,
	delete: deleteUser,
} as const
