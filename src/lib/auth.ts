"use server";

import { createServerClient } from "./supabase/server";

const supabase = createServerClient();

export async function verifyEmail(userId: string): Promise<void> {
  const { error } = await supabase
    .from("auth.users")
    .update({ email_verified: true })
    .eq("id", userId);

  if (error) throw error;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data: user, error } = await supabase
    .from("public.user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error || !user) return false;
  return user.role === "admin";
}
