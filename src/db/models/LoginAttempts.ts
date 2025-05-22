import type { CreatedAt } from "@/db/utils";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { UUID } from "node:crypto";

export type LoginAttempts = {
  id: Generated<UUID>;
  email: string;
  ip_address: string;
  attempted_at: CreatedAt;
  is_locked?: boolean;
  lock_expires_at?: Date;
};

export type LoginAttemptsSelect = Selectable<LoginAttempts>;
export type LoginAttemptsInsert = Insertable<LoginAttempts>;
export type LoginAttemptsUpdate = Updateable<LoginAttempts>;
