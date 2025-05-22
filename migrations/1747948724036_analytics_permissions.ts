import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
  await db
    .insertInto("casbin_rule")
    .values([
      { ptype: "p", v0: "admin", v1: "analytics", v2: "*" },
      { ptype: "p", v0: "admin", v1: "analytics", v2: "read" },
      { ptype: "p", v0: "admin", v1: "analytics", v2: "write" },
      { ptype: "p", v0: "admin", v1: "analytics", v2: "delete" },
    ])
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.deleteFrom("casbin_rule").where("v1", "=", "analytics").execute();
};
