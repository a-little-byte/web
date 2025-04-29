import type {
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";
import { UUID } from "node:crypto";

export interface ProductCategory {
  id: GeneratedAlways<UUID>;
  name: string;
  createdAt: GeneratedAlways<Date>;
  updatedAt: GeneratedAlways<Date>;
}

export type ProductCategorySelect = Selectable<ProductCategory>;
export type ProductCategoryInsert = Insertable<ProductCategory>;
export type ProductCategoryUpdate = Updateable<ProductCategory>;
