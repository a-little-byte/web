import type { Database } from "@/db";
import { type Kysely } from "kysely";
import { hash, verify, generateSalt } from "../src/api/c/hash/index.js";

const PEPPER = process.env.HASH_PEPPER || "default-pepper-value";

export async function seed(db: Kysely<Database>): Promise<void> {
  const passwordSalt = generateSalt()
  const hashedPassword = hash("password", passwordSalt, PEPPER);

  await db
    .insertInto("users")
    .values({
      email: "admin@example.com",
      password: hashedPassword,
      password_salt: passwordSalt,
      email_verified: new Date(),
      first_name: "Admin",
      last_name: "User",
      role: "admin",
    })
    .execute();
}
