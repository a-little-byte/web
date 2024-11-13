import { db } from "@alittlebyte/api/database"
import { defineConfig } from "kysely-ctl"

export default defineConfig({
	migrations: {
		migrationFolder: "src/database/migrations",
	},
	seeds: {
		seedFolder: "src/database/seeds",
	},
	kysely: db,
})
