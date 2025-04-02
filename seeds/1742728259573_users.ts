import type { Database } from "@/db";
import { type Kysely } from "kysely";
import { Hash, Verify } from "../src/api/c/hash/index.js";

const PEPPER = process.env.HASH_PEPPER || "default-pepper-value";

export async function seed(db: Kysely<Database>): Promise<void> {
  const { hash, salt } = Hash("password", PEPPER);

  await db
    .insertInto("users")
    .values({
      email: "admin@example.com",
      password: hash,
      password_salt: salt,
      email_verified: new Date(),
      first_name: "Admin",
      last_name: "User",
      role: "admin",
    })
    .execute();
}
