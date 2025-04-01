import type { Database } from "@/db";
import { Hash } from "@/api/c/hash/utils";
import { type Kysely } from "kysely";

const PEPPER = process.env.HASH_PEPPER || "default-pepper-value";

export async function seed(db: Kysely<Database>): Promise<void> {
  const hashedPassword = Hash("password", null, PEPPER);

  await db
    .insertInto("users")
    .values({
      email: "admin@example.com",
      password: hashedPassword,
      email_verified: new Date(),
      first_name: "Admin",
      last_name: "User",
      role: "admin",
    })
    .execute();
}
