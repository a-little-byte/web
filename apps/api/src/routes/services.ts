import type { PublicContextVariables } from "@alittlebyte/api/utils/types"
import { HTTP_STATUS_CODES } from "@alittlebyte/common/constants"
import {
	idValidator,
	OrderByEnum,
	productSearchValidator,
	serviceValidator,
} from "@alittlebyte/common/validators"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import { randomUUID } from "node:crypto"

export const servicesRouter = () =>
	new Hono<{ Variables: PublicContextVariables }>()
		.get(
			"/",
			zValidator(
				"query",
				z.object({ search: productSearchValidator, orderBy: OrderByEnum }),
			),
			async ({
				json,
				req,
				var: {
					repositories: { services },
				},
			}) => {
				const query = req.valid("query")

				return json({
					data: await services.findAll({
						criteria: query.search ? { nameLike: query.search } : {},
						...query,
					}),
				})
			},
		)
		.get(
			"/:serviceId",
			zValidator("param", z.object({ serviceId: idValidator })),
			async ({
				json,
				req,
				var: {
					repositories: { services, translations },
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

				const [description, technicalSpecifications] = await Promise.all([
					translations.findByKey(service.descriptionKey),
					translations.findByKey(service.technicalSpecificationsKey),
				])
				const enrichedService = {
					id: service.id,
					name: service.name,
					description: description?.content,
					technicalSpecifications: technicalSpecifications?.content,
					price: service.price,
					perUser: service.perUser,
					perDevice: service.perDevice,
					available: service.available,
				}

				return json({ data: enrichedService })
			},
		)
		.post(
			"/",
			zValidator("json", serviceValidator),
			async ({
				json,
				req,
				var: {
					repositories: { services, translations },
				},
			}) => {
				const postJson = req.valid("json")
				const { description, technicalSpecifications, ...rest } = postJson
				const descriptionKey = randomUUID()
				const technicalSpecificationsKey = randomUUID()

				await services.create({
					...rest,
					descriptionKey,
					technicalSpecificationsKey,
				})

				// add translations for french in db
				await Promise.all([
					translations.create({
						key: descriptionKey,
						languageCode: "en",
						content: description,
					}),
					translations.create({
						key: technicalSpecificationsKey,
						languageCode: "en",
						content: technicalSpecifications,
					}),
				])

				return json({ data: postJson })
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
					repositories: { services, translations },
				},
			}) => {
				const data = req.valid("json")
				const { description, technicalSpecifications, ...rest } = data
				const { serviceId } = req.valid("param")
				const foundService = await services.findById(serviceId)

				if (!foundService) {
					return json(
						{ message: "Unknown Service" },
						HTTP_STATUS_CODES.NOT_FOUND,
					)
				}

				if (description) {
					await translations.update(foundService.descriptionKey, {
						content: description,
					})
				}

				if (technicalSpecifications) {
					await translations.update(foundService.technicalSpecificationsKey, {
						content: technicalSpecifications,
					})
				}

				if (Object.keys(rest).length > 0) {
					await services.updateReturn(serviceId, rest)
				}

				return json({ data })
			},
		)
		.delete(
			"/:serviceId",
			zValidator("param", z.object({ serviceId: idValidator })),
			async ({
				json,
				req,
				var: {
					repositories: { services, translations },
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

				await Promise.all([
					services.delete(serviceId),
					translations.delete(foundService.descriptionKey),
					translations.delete(foundService.technicalSpecificationsKey),
				])

				return json({ message: "Successfully Deleted" })
			},
		)
