import { db } from "@alittlebyte/api/database"
import {
	NewService,
	Service,
	ServiceUpdate,
} from "@alittlebyte/api/database/types"
import { UUID } from "node:crypto"

const findAll = async ({
	criteria,
	orderBy,
}: {
	criteria: Partial<Service & { nameLike: string }>
	orderBy?: "price" | "newest" | "availability"
}) => {
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

	if (criteria.nameLike) {
		query = query.where("name", "like", `${criteria.nameLike}%`)
	}

	if (orderBy) {
		switch (orderBy) {
			case "price":
				query = query.orderBy("price")

				break

			case "newest":
				query = query.orderBy("createdAt", "desc")

				break

			case "availability":
				query = query.orderBy("available", "desc")

				break
		}
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
