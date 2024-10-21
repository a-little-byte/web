import prisma from "../../src/lib/prisma"
import { Prisma } from "@prisma/client"
import { faker } from "@faker-js/faker"

const MAX_ITER = 5

const generateData = (): Prisma.ServiceCreateInput => ({
	name: faker.commerce.productName(),
	descriptionKey: faker.string.uuid(),
	technicalSpecificationsKey: faker.string.uuid(),
	price: parseInt(faker.commerce.price()),
	perUser: faker.datatype.boolean(),
	perDevice: faker.datatype.boolean(),
	available: faker.datatype.boolean(),
})

;(async () => {
	for (let i = 0; i < MAX_ITER; i++) {
		try {
			const serviceData = generateData()
			const services = await prisma.service.create({
				data: serviceData,
			})
		} catch (error) {
			continue // in case the name is the same
		}
	}
})()
