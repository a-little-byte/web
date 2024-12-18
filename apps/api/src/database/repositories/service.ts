import { db } from "@alittlebyte/api/database"
import {
	NewService,
	Service,
	ServiceUpdate,
} from "@alittlebyte/api/database/types"
import { UUID } from "node:crypto"

const findAll = async (criteria: Partial<Service>) => {
	let query = db.selectFrom("services")

	if (criteria.id) {
		query = query.where("id", "=", criteria.id)
	}

	if (criteria.name) {
		query = query.where("name", "=", criteria.name)
	}

	if (criteria.createdAt) {
		query = query.where("createdAt", "=", criteria.createdAt)
	}

	return await query.selectAll().execute()
}
const findById = (id: UUID) =>
	db.selectFrom("services").where("id", "=", id).selectAll().executeTakeFirst()
const create = (service: NewService) =>
	db
		.insertInto("services")
		.values(service)
		.returningAll()
		.executeTakeFirstOrThrow()
const deleteService = (id: UUID) =>
	db
		.deleteFrom("services")
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirst()
const updateReturn = (id: UUID, updateWith: ServiceUpdate) =>
	db
		.updateTable("services")
		.set(updateWith)
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirst()
const update = async (id: UUID, updateWith: ServiceUpdate) => {
	await db
		.updateTable("services")
		.set(updateWith)
		.where("id", "=", id)
		.execute()
}

export const servicesRepository = {
	findAll,
	findById,
	create,
	updateReturn,
	update,
	delete: deleteService,
} as const
