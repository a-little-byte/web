import { defineConfig } from "kysely-ctl";
import { db } from "./src/db";

export default defineConfig({
  kysely: db,
});
