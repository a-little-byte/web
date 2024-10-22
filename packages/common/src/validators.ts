import { z } from "zod"

export const urlValidator = z.string().url()

export const emailValidator = z.string().email()

export const passwordValidator = z.string().min(6)

export const firstNameValidator = z.string().min(2)

export const lastNameValidator = z.string().min(2)
