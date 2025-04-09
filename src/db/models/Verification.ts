import { Generated, Insertable, Selectable, Updateable } from "kysely";
import { UUID } from "node:crypto";

export type Verification = {
  id: Generated<UUID>;
  user_id: UUID;
  email_token?: string;
  email_token_time?: Date; 
};

export type UserSelect = Selectable<Verification>;
export type UserInsert = Insertable<Verification>;
export type UserUpdate = Updateable<Verification>;
