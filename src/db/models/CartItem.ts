import type { CreatedAt, UpdatedAt } from "@/db/utils";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { UUID } from "node:crypto";

export type CartItem = {
  id: Generated<UUID>;
  user_id: UUID;
  service_id: UUID;
  quantity: number;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
};

export type CartItemSelect = Selectable<CartItem>;
export type CartItemInsert = Insertable<CartItem>;
export type CartItemUpdate = Updateable<CartItem>;
