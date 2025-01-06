import { CreateTableBuilder } from "kysely"

export const relationColumnUserId = (c: CreateTableBuilder<"">) =>
	c.addColumn("userId", "uuid", (col) =>
		col.references("users.id").onDelete("cascade").notNull(),
	)
