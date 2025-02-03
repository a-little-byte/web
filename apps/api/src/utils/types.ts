import { repositories } from "@alittlebyte/api/database"
import { Database } from "@alittlebyte/api/database/types"
import { UUID } from "crypto"
import { Kysely } from "kysely"

export interface PublicContextVariables {
	db: Kysely<Database>
	repositories: typeof repositories
}

export type PrivateContextVariables = PublicContextVariables & {
	user: {
		id: UUID
		email: string
	}
}
