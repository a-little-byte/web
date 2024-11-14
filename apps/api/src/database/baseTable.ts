import { CreateTableBuilder, sql } from "kysely"

export const baseTable = (c: CreateTableBuilder<"">) =>
	c
		.addColumn("id", "uuid", (col) =>
			col.primaryKey().defaultTo(sql`gen_random_uuid()`),
		)
		.addColumn("createdAt", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addColumn("updatedAt", "timestamp", (col) => col.defaultTo(sql`now()`))
