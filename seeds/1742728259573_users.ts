import type { Database } from "@/db";
import bcrypt from "bcrypt";
import { type Kysely } from "kysely";

export async function seed(db: Kysely<Database>): Promise<void> {
  const hashedPassword = await bcrypt.hash("password", 10);

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
