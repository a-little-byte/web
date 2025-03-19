import type { CreatedAt } from "@/db/utils";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { UUID } from "node:crypto";

export type Invoice = {
  id: Generated<UUID>;
  payment_id: string | null;
  number: string;
  file_url: string;
  created_at: CreatedAt;
};

export type InvoiceSelect = Selectable<Invoice>;
export type InvoiceInsert = Insertable<Invoice>;
export type InvoiceUpdate = Updateable<Invoice>;
