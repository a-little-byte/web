import type { CreatedAt, UpdatedAt } from "@/db/utils";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { UUID } from "node:crypto";

export type Subscription = {
  id: Generated<UUID>;
  user_id: UUID;
  service_id: UUID;
  status: string;
  current_period_start: Date;
  current_period_end: Date;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
};

export type SubscriptionSelect = Selectable<Subscription>;
export type SubscriptionInsert = Insertable<Subscription>;
export type SubscriptionUpdate = Updateable<Subscription>;
