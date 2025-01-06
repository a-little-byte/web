import { CreateTableBuilder } from "kysely"
import { DataTypeExpression } from "kysely/dist/cjs/parser/data-type-parser"

export const notNullColumn =
	(name: string, type: DataTypeExpression = "text") =>
	(c: CreateTableBuilder<"">) =>
		c.addColumn(name, type, (col) => col.notNull())
