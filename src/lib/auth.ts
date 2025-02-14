import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "./supabase";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function createUser(userData: {
  email: string;
  password: string;
  full_name?: string;
  email_verified?: boolean;
}) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const { data: user, error } = await supabase
    .from("auth.users")
    .insert([
      {
        ...userData,
        password: hashedPassword,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return user;
}

export async function verifyUser(email: string, password: string) {
  const { data: user, error } = await supabase
    .from("auth.users")
    .select()
    .eq("email", email)
    .single();

  if (error || !user) return null;

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return null;

  return user;
}

export function generateToken(user: any): string {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export async function verifyEmail(userId: string): Promise<void> {
  const { error } = await supabase
    .from("auth.users")
    .update({ email_verified: true })
    .eq("id", userId);

  if (error) throw error;
}

export async function getUserById(id: string) {
  const { data: user, error } = await supabase
    .from("auth.users")
    .select()
    .eq("id", id)
    .single();

  if (error) return undefined;
  return user;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data: user, error } = await supabase
    .from("auth.users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !user) return false;
  return user.role === "admin";
}
