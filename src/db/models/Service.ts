import type { CreatedAt, UpdatedAt } from "@/db/utils";
import type {
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from "kysely";
import type { UUID } from "node:crypto";

export type Service = {
  id: Generated<UUID>;
  name: string;
  description: string;
  price: number;
  period: string;
  features: JSONColumnType<Array<string>>;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
};

export type ServiceSelect = Selectable<Service>;
export type ServiceInsert = Insertable<Service>;
export type ServiceUpdate = Updateable<Service>;
