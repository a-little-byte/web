import type { Database } from "@/db";
import { ATTRIBUTES } from "@/db/models/CasbinRule";
import type { Kysely } from "kysely";

export const seed = async (db: Kysely<Database>) => {
  await db
    .insertInto("casbin_rule")
    .values(
      Object.entries(ATTRIBUTES).flatMap(([resource, attributes]) =>
        Object.keys(attributes).map((attribute) => ({
          ptype: "p",
          v0: "admin",
          v1: resource,
          v2: attribute,
        }))
      )
    )
    .execute();
};
