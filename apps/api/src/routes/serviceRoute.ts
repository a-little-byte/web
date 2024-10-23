import { Hono } from "hono"
import { PublicContextVariables } from "@alittlebyte/api/utils/types"
import { zValidator } from "@hono/zod-validator"
import { idValidator, serviceValidator } from "@alittlebyte/common/validators"
import { z } from "zod"

export const servicesRouter = () =>
	new Hono<{ Variables: PublicContextVariables }>()
		.get("/", async ({ json, var: { prisma } }) => {
			const services = await prisma.service.findMany()
			return json({ message: services }, 200)
		})
		.get(
			"/:serviceId",
			zValidator("param", z.object({ serviceId: idValidator })),
			async ({ json, req, var: { prisma } }) => {
				const { serviceId } = req.valid("param")
				const service = await prisma.service.findFirst({
					where: { id: serviceId },
				})

				if (!service) return json({ message: "Unknown Service" }, 404)

				return json({ message: service }, 200)
			},
		)
		.post(
			"/",
			zValidator("json", serviceValidator),
			async ({ json, req, var: { prisma } }) => {
				const data = req.valid("json")
				const postService = await prisma.service.create({ data })

				return json({ message: postService }, 200)
			},
		)
		.put(
			"/:serviceId",
			zValidator("json", serviceValidator.partial()),
			zValidator("param", z.object({ serviceId: idValidator })),
			async ({ json, req, var: { prisma } }) => {
				const data = req.valid("json")
				const { serviceId } = req.valid("param")
				const foundService = await prisma.service.findFirst({
					where: { id: serviceId },
				})

				if (!foundService)
					return json({ message: "This survice does not exsist" }, 400)

				const updateService = await prisma.service.update({
					where: { id: serviceId },
					data,
				})

				return json({ message: updateService }, 200)
			},
		)
		.delete(
			"/:serviceId",
			zValidator("param", z.object({ serviceId: idValidator })),
			async ({ json, req, var: { prisma } }) => {
				const { serviceId } = req.valid("param")
				const foundService = await prisma.service.findFirst({
					where: { id: serviceId },
				})

				if (!foundService)
					return json({ message: "This survice does not exsist" }, 400)

				await prisma.service.delete({
					where: { id: serviceId },
				})

				return json({ message: "Succsessfully Deleted" }, 200)
			},
		)
