import { repositories } from "@alittlebyte/api/database"
import { Database } from "@alittlebyte/api/database/types"
import type { Session, User } from "@alittlebyte/api/lib/auth"
import { Kysely } from "kysely"

export interface PublicContextVariables {
	db: Kysely<Database>
	repositories: typeof repositories
}

export type PrivateContextVariables = PublicContextVariables & {
	user: User
	session: Session
}
