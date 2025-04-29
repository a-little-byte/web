import type { Database } from "@/db";
import { ATTRIBUTES } from "@/db/models/CasbinRule";
import type { Kysely } from "kysely";

export const seed = async (db: Kysely<Database>) => {
  await db
    .insertInto("casbin_rule")
    .values([
      ...Object.entries(ATTRIBUTES).flatMap(([resource, attributes]) =>
        Object.keys(attributes).map((attribute) => ({
          ptype: "p",
          v0: "admin",
          v1: resource,
          v2: attribute,
        }))
      ),
      ...[
        {
          ptype: "p",
          v0: "user",
          v1: "services",
          v2: "read",
        },
        {
          ptype: "p",
          v0: "user",
          v1: "subscriptions",
          v2: "read",
        },
        {
          ptype: "p",
          v0: "user",
          v1: "invoices",
          v2: "read",
        },
        {
          ptype: "p",
          v0: "user",
          v1: "hero_carousel",
          v2: "read",
        },
        {
          ptype: "p",
          v0: "user",
          v1: "orders",
          v2: "read",
        },
        {
          ptype: "p",
          v0: "user",
          v1: "payments",
          v2: "read",
        },
        {
          ptype: "p",
          v0: "user",
          v1: "chat",
          v2: "create",
        },
        {
          ptype: "p",
          v0: "user",
          v1: "chat",
          v2: "send",
        },
        {
          ptype: "p",
          v0: "user",
          v1: "chat",
          v2: "read",
        },
      ],
    ])
    .execute();
};
