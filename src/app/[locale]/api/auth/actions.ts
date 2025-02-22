"use server";

import { createServerClient } from "@/lib/supabase/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return redirect("/dashboard");
};

export const register = async (
  email: string,
  password: string,
  fullName: string
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const supabase = createServerClient();

    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          full_name: fullName,
          email_verified: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const verificationToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return { success: true, verificationToken };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Registration failed" };
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const supabase = createServerClient();

    const { error } = await supabase
      .from("users")
      .update({ email_verified: true })
      .eq("id", decoded.userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Verification error:", error);
    return { error: "Verification failed" };
  }
};

export const getCurrentUser = async () => {
  const token = cookies().get("auth-token")?.value;
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const supabase = createServerClient();

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.userId)
      .single()
      .throwOnError();
    return user || null;
  } catch (error) {
    return null;
  }
};

export const logout = async () => {
  cookies().delete("auth-token");
  return { success: true };
};
