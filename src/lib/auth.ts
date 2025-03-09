"use server";

import { db } from "@/db";
import type { UUID } from "node:crypto";

export async function verifyEmail(userId: UUID): Promise<void> {
  await db
    .updateTable("users")
    .set({ email_verified: true })
    .where("id", "=", userId)
    .executeTakeFirstOrThrow();
}

export async function isAdmin(userId: UUID): Promise<boolean> {
  const user = await db
    .selectFrom("users")
    .select("role")
    .where("id", "=", userId)
    .executeTakeFirstOrThrow();

  return user.role === "admin";
}
