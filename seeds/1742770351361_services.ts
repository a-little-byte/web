import type { Database } from "@/db/index";
import type { Kysely } from "kysely";

export const seed = async (db: Kysely<Database>): Promise<void> => {
  await db
    .insertInto("services")
    .values([
      {
        name: "MDR",
        description: "Managed Detection and Response",
        price: 1000,
        period: "monthly",
        stripe_id: "price_1RJDaxRSoOb0mCIyuN2DK7nm",
        features: JSON.stringify([
          "monitoring",
          "detection",
          "response",
          "compliance",
          "analytics",
        ]),
      },
      {
        name: "EDR",
        description: "Endpoint Detection and Response",
        price: 1000,
        period: "monthly",
        stripe_id: "price_1RJDbERSoOb0mCIyoYjlwZzV",
        features: JSON.stringify([
          "protection",
          "analysis",
          "response",
          "control",
          "hunting",
        ]),
      },
      {
        name: "XDR",
        description: "Extended Detection and Response",
        price: 1000,
        period: "monthly",
        stripe_id: "price_1RJDbVRSoOb0mCIyVdnTLsJH",
        features: JSON.stringify([
          "protection",
          "analytics",
          "workflows",
          "intelligence",
          "reporting",
        ]),
      },
    ])
    .execute();
};
