import type { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface CasbinRule {
  id: Generated<number>;
  ptype: string;
  v0: string;
  v1: string;
  v2: string;
  v3: string | null;
  v4: string | null;
  v5: string | null;
}

export type CasbinRuleSelect = Selectable<CasbinRule>;
export type CasbinRuleInsert = Insertable<CasbinRule>;
export type CasbinRuleUpdate = Updateable<CasbinRule>;

export const ATTRIBUTES = {
  chat: {
    read: "read",
    send: "send",
    create: "create",
    close: "close",
    ingest: "ingest",
  },
  services: {
    read: "read",
    create: "create",
    update: "update",
    delete: "delete",
  },
  subscriptions: {
    read: "read",
  },
  invoices: {
    read: "read",
  },
  hero_carousel: {
    read: "read",
    create: "create",
    update: "update",
    delete: "delete",
  },
  orders: {
    read: "read",
  },
  payments: {
    read: "read",
  },
  payment_methods: {
    read: "read",
    create: "create",
    update: "update",
    delete: "delete",
  }
} as const;

export type Attribute = {
  [K in string &
    keyof typeof ATTRIBUTES]: keyof (typeof ATTRIBUTES)[K] extends string
    ? `${K}.${keyof (typeof ATTRIBUTES)[K]}`
    : never;
}[keyof typeof ATTRIBUTES];
