import { Session, User } from "@alittlebyte/api/lib/auth"
import { PrismaClient } from "@prisma/client"

export interface PublicContextVariables { prisma: PrismaClient }

export type PrivateContextVariables = PublicContextVariables & {
	user: User
	session: Session
}
