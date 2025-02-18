"use server";

import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const login = async (email: string, password: string) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return { error: "Invalid credentials" };
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return { error: "Invalid credentials" };
    }

    if (!user.email_verified) {
      return { error: "Email not verified" };
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Login failed" };
  }
};

export const register = async (
  email: string,
  password: string,
  fullName: string
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

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
