import type { CreatedAt } from "@/db/utils";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { UUID } from "node:crypto";

export type TOTPSecret = {
  id: Generated<UUID>;
  user_id: UUID;
  secret: string;
  enabled: boolean;
};

export type TOTPSecretSelect = Selectable<TOTPSecret>;
export type TOTPSecretInsert = Insertable<TOTPSecret>;
export type TOTPSecretUpdate = Updateable<TOTPSecret>;

export type TOTPTemp = {
  id: Generated<UUID>;
  user_id: UUID;
  secret: string;
  createdAt: CreatedAt;
};

export type TOTPTempSelect = Selectable<TOTPTemp>;
export type TOTPTempInsert = Insertable<TOTPTemp>;
export type TOTPTempUpdate = Updateable<TOTPTemp>;
