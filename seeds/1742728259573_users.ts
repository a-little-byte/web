import { Hash } from "@/api/c/hash/index";
import { apiConfig } from "@/api/config";
import type { Database } from "@/db";
import { type Kysely } from "kysely";

export async function seed(db: Kysely<Database>): Promise<void> {
  const { hash, salt } = await Hash("password", apiConfig.pepper);

  const user = await db
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
    .returningAll()
    .executeTakeFirstOrThrow();

  await db
    .insertInto("casbin_rule")
    .values({
      ptype: "g",
      v0: user.id,
      v1: "admin",
      v2: "",
    })
    .execute();
}
