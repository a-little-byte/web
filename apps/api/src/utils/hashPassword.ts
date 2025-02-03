import bcrypt from "bcrypt"

export const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(12)

	return {
		passwordSalt: salt,
		passwordHash: await bcrypt.hash(password, salt),
	}
}

export const validatePassword = (
	plainPassword: string,
	hashedPassword: string,
): Promise<boolean> => bcrypt.compare(plainPassword, hashedPassword)
