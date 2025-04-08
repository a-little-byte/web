import type { Database } from "@/db";
import { type Kysely } from "kysely";
import { Hash, Verify } from "../src/api/c/hash/index";
import { apiConfig } from "../src/api/config";


export async function seed(db: Kysely<Database>): Promise<void> {
  const { hash, salt } = await Hash("password", apiConfig.pepper);

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
