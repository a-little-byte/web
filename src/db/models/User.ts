import type { CreatedAt, UpdatedAt } from "@/db/utils";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { UUID } from "node:crypto";

export type User = {
  id: Generated<UUID>;
  email: string;
  password: string;
  password_salt: string;
  first_name: string;
  last_name: string;
  role: string;
  email_verified: Date | null;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
};

export type UserSelect = Selectable<User>;
export type UserInsert = Insertable<User>;
export type UserUpdate = Updateable<User>;
