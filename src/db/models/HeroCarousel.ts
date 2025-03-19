import type { CreatedAt, UpdatedAt } from "@/db/utils";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { UUID } from "node:crypto";

export type HeroCarousel = {
  id: Generated<UUID>;
  title: string;
  description: string;
  image_url: string;
  button_text?: string;
  button_link?: string;
  order: number;
  active: boolean;
  created_at: CreatedAt;
  updated_at: UpdatedAt;
};

export type HeroCarouselSelect = Selectable<HeroCarousel>;
export type HeroCarouselInsert = Insertable<HeroCarousel>;
export type HeroCarouselUpdate = Updateable<HeroCarousel>;
