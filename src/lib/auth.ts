"use server";

import { db } from "@/db";

export async function verifyEmail(userId: string): Promise<void> {
  await db
    .updateTable("users")
    .set({ email_verified: true })
    .where("id", "=", userId)
    .executeTakeFirstOrThrow();
}

export async function isAdmin(userId: string): Promise<boolean> {
  const user = await db
    .selectFrom("users")
    .select("role")
    .where("id", "=", userId)
    .executeTakeFirstOrThrow();

  return user.role === "admin";
}
