import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
  await db
    .insertInto("casbin_rule")
    .values([
      { ptype: "p", v0: "admin", v1: "subscriptions", v2: "*" },
      { ptype: "p", v0: "admin", v1: "services", v2: "*" },
      { ptype: "p", v0: "admin", v1: "users", v2: "*" },
      { ptype: "p", v0: "admin", v1: "invoices", v2: "*" },
      { ptype: "p", v0: "admin", v1: "payments", v2: "*" },
      { ptype: "p", v0: "admin", v1: "chat", v2: "*" },
      { ptype: "p", v0: "admin", v1: "hero_carousel", v2: "*" },
      { ptype: "p", v0: "user", v1: "chat", v2: "read" },
      { ptype: "p", v0: "user", v1: "chat", v2: "send" },
      { ptype: "p", v0: "user", v1: "chat", v2: "create" },
      { ptype: "p", v0: "user", v1: "chat", v2: "close" },
      { ptype: "p", v0: "user", v1: "services", v2: "read" },
      { ptype: "p", v0: "user", v1: "subscriptions", v2: "read" },
      { ptype: "p", v0: "user", v1: "invoices", v2: "read" },
      { ptype: "p", v0: "user", v1: "hero_carousel", v2: "read" },
      { ptype: "p", v0: "user", v1: "orders", v2: "read" },
    ])
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.deleteFrom("casbin_rule").execute();
};
