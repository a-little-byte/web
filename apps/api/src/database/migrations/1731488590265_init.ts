import { baseTable } from "@alittlebyte/api/database/baseTable"
import { notNullColumn } from "@alittlebyte/api/database/notNullColumn"
import { relationColumnUserId } from "@alittlebyte/api/database/relationColumnUserId"
import type { Database } from "@alittlebyte/api/database/types"
import { Kysely } from "kysely"

export const up = async (db: Kysely<Database>): Promise<void> => {
	await db.schema
		.createTable("users")
		.$call(baseTable)
		.$call(notNullColumn("name"))
		.$call(notNullColumn("firstName"))
		.$call(notNullColumn("lastName"))
		.$call(notNullColumn("email"))
		.$call(notNullColumn("emailVerified", "boolean"))
		.addColumn("twoFactorEnabled", "boolean")
		.addUniqueConstraint("name_and_email_unique", ["email", "name"])
		.execute()

	await db.schema
		.createTable("accounts")
		.$call(baseTable)
		.$call(notNullColumn("accountId"))
		.$call(notNullColumn("providerId"))
		.addColumn("accessToken", "text")
		.addColumn("refreshToken", "text")
		.addColumn("idToken", "text")
		.addColumn("expiresAt", "timestamp")
		.addColumn("password", "text")
		.$call(relationColumnUserId)
		.execute()

	await db.schema
		.createTable("sessions")
		.$call(baseTable)
		.$call(notNullColumn("expiresAt", "timestamp"))
		.addColumn("ipAddress", "varchar(39)")
		.addColumn("userAgent", "text")
		.$call(relationColumnUserId)
		.execute()

	await db.schema
		.createTable("verifications")
		.$call(baseTable)
		.$call(notNullColumn("identifier"))
		.$call(notNullColumn("value"))
		.$call(notNullColumn("expiresAt", "timestamp"))
		.execute()

	await db.schema
		.createTable("twoFactors")
		.$call(baseTable)
		.$call(notNullColumn("secret"))
		.$call(notNullColumn("backupCodes"))
		.$call(relationColumnUserId)
		.execute()

	await db.schema
		.createTable("creditCards")
		.$call(baseTable)
		.addColumn("cardNumber", "varchar(16)", (col) => col.notNull().unique())
		.$call(notNullColumn("expirationDate", "timestamp"))
		.$call(notNullColumn("cvvCode", "varchar(3)"))
		.$call(relationColumnUserId)
		.execute()

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
	await db.schema.dropTable("accounts").execute()
	await db.schema.dropTable("services").execute()
	await db.schema.dropTable("sessions").execute()
	await db.schema.dropTable("verifications").execute()
	await db.schema.dropTable("twoFactors").execute()
	await db.schema.dropTable("users").execute()
}
