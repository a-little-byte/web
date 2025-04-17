import type { CreatedAt, UpdatedAt } from "@/db/utils";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { UUID } from "node:crypto";

export type PaymentMethod = {
  id: Generated<UUID>;
  user_id: UUID | null;
  payment_token: string;
  iv: string;
  type: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
};

export type PaymentMethodSelect = Selectable<PaymentMethod>;
export type PaymentMethodInsert = Insertable<PaymentMethod>;
export type PaymentMethodUpdate = Updateable<PaymentMethod>;

export type Payment = {
  id: Generated<UUID>;
  subscription_id: UUID;
  amount: number;
  status: string;
  payment_method: string;
  createdAt: CreatedAt;
  billing_address_id: UUID | null;
  payment_method_id: UUID | null;
};

export type PaymentSelect = Selectable<Payment>;
export type PaymentInsert = Insertable<Payment>;
export type PaymentUpdate = Updateable<Payment>;
