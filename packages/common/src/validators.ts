import { z } from "zod"
import type { UUID } from "node:crypto"

export const idValidator = z
	.string()
	.uuid()
	.transform((arg) => arg as UUID)

export const urlValidator = z.string().url()

export const emailValidator = z.string().email()

export const passwordValidator = z.string().min(8)

export const firstNameValidator = z.string().min(2)

export const lastNameValidator = z.string().min(2)

export const productNameValidator = z.string().min(6)

export const descriptionKeyValidator = z.string().min(6)

export const technicalSpecificationsKeyValidator = z.string().min(6)

export const priceValidator = z.number().min(0.99)

export const perUserValidator = z.boolean()

export const perDeviceValidator = z.boolean()

export const availableValidator = z.boolean()

export const serviceValidator = z.object({
	name: productNameValidator,
	descriptionKey: descriptionKeyValidator,
	technicalSpecificationsKey: technicalSpecificationsKeyValidator,
	price: priceValidator,
	perUser: perUserValidator,
	perDevice: perDeviceValidator,
	available: availableValidator,
})

export const cardNumberValidator = z.string().min(16).max(16)

export const expirationDateValidator = z.string().datetime()

export const cvvCodeValidator = z.string().min(3).max(3)

export const creditCardValidator = z.object({
	cardNumber: cardNumberValidator,
	expirationDate: expirationDateValidator,
	cvvCode: cvvCodeValidator,
})
