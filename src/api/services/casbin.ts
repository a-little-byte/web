import { newEnforcer } from "casbin";
import { BasicAdapter } from "casbin-basic-adapter";
import path from "node:path";
import { Client } from "pg";

export const CASBIN_TABLE = "casbin_rule";

const adapter = await BasicAdapter.newAdapter(
  "pg",
  new Client({
    connectionString: process.env.DATABASE_URL,
  }),
  CASBIN_TABLE
);

export const enforcer = await newEnforcer(
  path.join(__dirname, "src/db/models/rbac_model.conf"),
  adapter
);
