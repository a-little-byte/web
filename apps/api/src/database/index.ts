import { apiConfig } from "@alittlebyte/api/config"
import { creditCardsRepository } from "@alittlebyte/api/database/repositories/creditCard"
import { servicesRepository } from "@alittlebyte/api/database/repositories/service"
import { usersRepository } from "@alittlebyte/api/database/repositories/user"
import { Database } from "@alittlebyte/api/database/types"
import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"
import { translationRepository } from "./repositories/translation"

export const dialect = new PostgresDialect({
	pool: new Pool(apiConfig.db),
})

export const db = new Kysely<Database>({
	dialect,
})

export const repositories = {
	users: usersRepository,
	services: servicesRepository,
	creditCards: creditCardsRepository,
	translations: translationRepository,
} as const
