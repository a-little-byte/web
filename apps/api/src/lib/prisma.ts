/* eslint-disable no-var */

import { PrismaClient } from "@prisma/client"

declare global {
	// eslint-disable-next-line init-declarations
	var prisma: PrismaClient | undefined
}

const prismaDb = globalThis.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
	globalThis.prisma = prismaDb
}

export default prismaDb
