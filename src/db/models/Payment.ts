import type { CreatedAt, UpdatedAt } from "@/db/utils";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { UUID } from "node:crypto";

export type PaymentMethod = {
  id: Generated<UUID>;
  user_id: UUID | null;
  type: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  created_at: CreatedAt;
  updated_at: UpdatedAt;
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
  created_at: CreatedAt;
  billing_address_id: UUID | null;
  payment_method_id: UUID | null;
};

export type PaymentSelect = Selectable<Payment>;
export type PaymentInsert = Insertable<Payment>;
export type PaymentUpdate = Updateable<Payment>;
