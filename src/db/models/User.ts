import type { CreatedAt, UpdatedAt } from "@/db/utils";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { UUID } from "node:crypto";

export type User = {
  id: Generated<UUID>;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  email_verified: boolean;
  created_at: CreatedAt;
  updated_at: UpdatedAt;
};

export type UserSelect = Selectable<User>;
export type UserInsert = Insertable<User>;
export type UserUpdate = Updateable<User>;
