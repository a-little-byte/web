import type { PublicContextVariables } from "@alittlebyte/api/utils/types"
import { HTTP_STATUS_CODES } from "@alittlebyte/common/constants"
import { idValidator, serviceValidator } from "@alittlebyte/common/validators"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

export const servicesRouter = () =>
	new Hono<{ Variables: PublicContextVariables }>()
		.get(
			"/",
			async ({
				json,
				var: {
					repositories: { services },
				},
			}) => json({ data: await services.findAll({}) }),
		)
		.get(
			"/:serviceId",
			zValidator("param", z.object({ serviceId: idValidator })),
			async ({
				json,
				req,
				var: {
					repositories: { services },
				},
			}) => {
				const { serviceId } = req.valid("param")
				const service = await services.findById(serviceId)

				if (!service) {
					return json(
						{ message: "Unknown Service" },
						HTTP_STATUS_CODES.NOT_FOUND,
					)
				}

				return json({ data: service })
			},
		)
		.post(
			"/",
			zValidator("json", serviceValidator),
			async ({
				json,
				req,
				var: {
					repositories: { services },
				},
			}) => {
				const postJson = req.valid("json")

				return json({ data: await services.create(postJson) })
			},
		)
		.put(
			"/:serviceId",
			zValidator("json", serviceValidator.partial()),
			zValidator("param", z.object({ serviceId: idValidator })),
			async ({
				json,
				req,
				var: {
					repositories: { services },
				},
			}) => {
				const data = req.valid("json")
				const { serviceId } = req.valid("param")
				const foundService = await services.findById(serviceId)

				if (!foundService) {
					return json(
						{ data: "This service does not exist" },
						HTTP_STATUS_CODES.NOT_FOUND,
					)
				}

				const updateService = await services.updateReturn(serviceId, data)

				return json({ data: updateService })
			},
		)
		.delete(
			"/:serviceId",
			zValidator("param", z.object({ serviceId: idValidator })),
			async ({
				json,
				req,
				var: {
					repositories: { services },
				},
			}) => {
				const { serviceId } = req.valid("param")
				const foundService = await services.findById(serviceId)

				if (!foundService) {
					return json(
						{ message: "This service does not exist" },
						HTTP_STATUS_CODES.NOT_FOUND,
					)
				}

				await services.delete(serviceId)

				return json({ message: "Successfully Deleted" })
			},
		)
