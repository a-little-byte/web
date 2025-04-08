import "tsconfig-paths/register";

import { db } from "@/db";
import { defineConfig } from "kysely-ctl";

export default defineConfig({
  kysely: db,
});
