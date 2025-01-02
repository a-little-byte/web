import type {
	ColumnType,
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from "kysely"
import type { UUID } from "node:crypto"

export type Database = {
	accounts: AccountTable
	"accounts.user": UserTable
	creditCards: CreditCardTable
	"creditCards.user": UserTable
	services: ServiceTable
	translations: TranslationTable
	sessions: SessionTable
	twoFactors: TwoFactorTable
	"twoFactors.user": UserTable
	users: UserTable
	"users.accounts": AccountTable
	"users.creditCards": CreditCardTable
	"users.sessions": SessionTable
	"users.twoFactors": TwoFactorTable
	verifications: VerificationTable
}

export type ServiceTable = {
	id: Generated<UUID>
	name: string
	descriptionKey: string
	technicalSpecificationsKey: string
	price: number
	perUser: boolean
	perDevice: boolean
	available: boolean
	createdAt: ColumnType<Date, string | undefined, never>
	updatedAt: ColumnType<Date, never, string | Date>
}

export type Service = Selectable<ServiceTable>

export type NewService = Insertable<ServiceTable>

export type ServiceUpdate = Updateable<ServiceTable>

export type TranslationTable = {
	id: Generated<UUID>
	languageCode: string
	key: string
	content: string
	serviceId: UUID
	createdAt: ColumnType<Date, string | undefined, never>
	updatedAt: ColumnType<Date, never, string | Date>
}

export type Translation = Selectable<TranslationTable>

export type NewTranslation = Insertable<TranslationTable>

export type TranslationUpdate = Updateable<TranslationTable>

export type CreditCardTable = {
	id: Generated<UUID>
	userId: UUID
	createdAt: ColumnType<Date, string | undefined, never>
	updatedAt: ColumnType<Date, never, string | Date>
}

export type CreditCard = Selectable<CreditCardTable>

export type NewCreditCard = Insertable<CreditCardTable>

export type CreditCardUpdate = Updateable<CreditCardTable>

export type UserTable = {
	id: Generated<UUID>
	name: string
	firstName: string
	lastName: string
	email: string
	emailVerified: boolean
	image?: string
	twoFactorEnabled?: boolean
	creditCards: CreditCard[]
	createdAt: ColumnType<Date, string | undefined, never>
	updatedAt: ColumnType<Date, never, string | Date>
}

export type User = Selectable<UserTable>

export type NewUser = Insertable<UserTable>

export type UserUpdate = Updateable<UserTable>

export type SessionTable = {
	id: Generated<UUID>
	expiresAt: Date
	ipAddress?: string
	userAgent?: string
	userId: UUID
}

export type Session = Selectable<SessionTable>

export type NewSession = Insertable<SessionTable>

export type SessionUpdate = Updateable<SessionTable>

export type AccountTable = {
	id: Generated<UUID>
	accountId: string
	providerId: string
	userId: UUID
	accessToken?: string
	refreshToken?: string
	idToken?: string
	expiresAt: ColumnType<
		Date,
		Date | string | undefined,
		string | Date | undefined
	>
	password?: string
}

export type Account = Selectable<AccountTable>

export type NewAccount = Insertable<AccountTable>

export type AccountUpdate = Updateable<AccountTable>

export type TwoFactorTable = {
	id: Generated<UUID>
	secret: string
	backupCodes: string
	userId: UUID
}

export type TwoFactor = Selectable<TwoFactorTable>

export type NewTwoFactor = Insertable<TwoFactorTable>

export type TwoFactorUpdate = Updateable<TwoFactorTable>

export type VerificationTable = {
	id: Generated<UUID>
	identifier: string
	value: string
	expiresAt: ColumnType<Date, string | Date, string | Date>
}

export type Verification = Selectable<VerificationTable>

export type NewVerification = Insertable<VerificationTable>

export type VerificationUpdate = Updateable<VerificationTable>
