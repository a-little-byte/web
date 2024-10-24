import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
	const users = await prisma.creditCard.findMany()
	console.log(users)
}
main()
