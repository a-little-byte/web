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
      },
      {
        name: "EDR",
        description: "Endpoint Detection and Response",
        price: 1000,
        period: "monthly",
      },
      {
        name: "XDR",
        description: "Extended Detection and Response",
        price: 1000,
        period: "monthly",
      },
    ])
    .execute();
};
