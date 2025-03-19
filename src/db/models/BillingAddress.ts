import type { CreatedAt, UpdatedAt } from "@/db/utils";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { UUID } from "node:crypto";

export type BillingAddress = {
  id: Generated<UUID>;
  user_id: UUID;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
};

export type BillingAddressSelect = Selectable<BillingAddress>;
export type BillingAddressInsert = Insertable<BillingAddress>;
export type BillingAddressUpdate = Updateable<BillingAddress>;
