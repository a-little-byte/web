import type { ColumnType } from "kysely";

export type CreatedAt = ColumnType<Date, never, never>;

export type UpdatedAt = ColumnType<Date, never, never>;
