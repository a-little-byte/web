import { Hono } from "hono"
import { PublicContextVariables } from "@alittlebyte/api/utils/types"
import { zValidator } from "@hono/zod-validator"
import { idValidator, serviceValidator } from "@alittlebyte/common/validators"
import { HTTP_STATUS_CODES } from "@alittlebyte/common/constants"
import { z } from "zod"

export const servicesRouter = () =>
	new Hono<{ Variables: PublicContextVariables }>()
		.get("/", async ({ json, var: { prisma } }) => {
			const services = await prisma.service.findMany()
			return json({ data: services })
		})
		.get(
			"/:serviceId",
			zValidator("param", z.object({ serviceId: idValidator })),
			async ({ json, req, var: { prisma } }) => {
				const { serviceId } = req.valid("param")
				const service = await prisma.service.findFirst({
					where: { id: serviceId },
				})

				if (!service)
					return json(
						{ message: "Unknown Service" },
						HTTP_STATUS_CODES.NOT_FOUND,
					)

				return json({ data: service })
			},
		)
		.post(
			"/",
			zValidator("json", serviceValidator),
			async ({ json, req, var: { prisma } }) => {
				const postJson = req.valid("json")
				const postService = await prisma.service.create({ data: postJson })

				return json({ data: postService })
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
					return json(
						{ data: "This survice does not exsist" },
						HTTP_STATUS_CODES.NOT_FOUND,
					)

				const updateService = await prisma.service.update({
					where: { id: serviceId },
					data,
				})

				return json({ data: updateService })
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
					return json(
						{ message: "This survice does not exsist" },
						HTTP_STATUS_CODES.NOT_FOUND,
					)

				await prisma.service.delete({
					where: { id: serviceId },
				})

				return json({ message: "Succsessfully Deleted" })
			},
		)
