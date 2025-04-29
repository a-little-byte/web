import type {
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";
import type { UUID } from "node:crypto";

export interface Product {
  id: GeneratedAlways<UUID>;
  name: string;
  price: number;
  category_id: UUID;
  created_at: GeneratedAlways<Date>;
  updated_at: GeneratedAlways<Date>;
}

export type ProductSelect = Selectable<Product>;
export type ProductInsert = Insertable<Product>;
export type ProductUpdate = Updateable<Product>;
