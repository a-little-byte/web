import { CreateTableBuilder } from "kysely"

export const serviceTranslationColumn = (c: CreateTableBuilder<"">) =>
	c.addColumn("serviceId", "uuid", (col) =>
		col.references("services.id").onDelete("cascade").notNull(),
	)
