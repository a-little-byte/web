import type { CreatedAt } from "@/db/utils";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { UUID } from "node:crypto";

export type Analytics = {
  id: Generated<UUID>;
  url: string;
  method: string;
  status_code: number;
  response_time: number; // milliseconds
  user_agent: string | null;
  ip_address: string | null;
  user_id: UUID | null;
  referer: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null; // mobile, desktop, tablet
  browser: string | null;
  os: string | null;
  createdAt: CreatedAt;
};

export type AnalyticsSelect = Selectable<Analytics>;
export type AnalyticsInsert = Insertable<Analytics>;
export type AnalyticsUpdate = Updateable<Analytics>;
