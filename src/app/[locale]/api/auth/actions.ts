"use server";

import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function login(email: string, password: string) {
  // try {
  //   const user = await db
  //     .selectFrom("users")
  //     .where("email", "=", email)
  //     .selectAll()
  //     .executeTakeFirst();
  //   if (!user) {
  //     return { error: "Invalid credentials" };
  //   }
  //   const validPassword = await bcrypt.compare(password, user.password);
  //   if (!validPassword) {
  //     return { error: "Invalid credentials" };
  //   }
  //   if (!user.email_verified) {
  //     return { error: "Email not verified" };
  //   }
  //   const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
  //     expiresIn: "7d",
  //   });
  //   // Set HTTP-only cookie
  //   cookies().set("auth-token", token, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "lax",
  //     maxAge: 7 * 24 * 60 * 60, // 7 days
  //   });
  //   return {
  //     user: {
  //       id: user.id,
  //       email: user.email,
  //       fullName: user.full_name,
  //     },
  //   };
  // } catch (error) {
  //   console.error("Login error:", error);
  //   return { error: "Login failed" };
  // }
}

export async function register(
  email: string,
  password: string,
  fullName: string
) {
  // try {
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const user = await db
  //     .insertInto("users")
  //     .values({
  //       email,
  //       password: hashedPassword,
  //       full_name: fullName,
  //       email_verified: false,
  //     })
  //     .returningAll()
  //     .executeTakeFirstOrThrow();
  //   // Generate verification token
  //   const verificationToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
  //     expiresIn: "1d",
  //   });
  //   // Here you would typically send an email with the verification token
  //   // For now, we'll just return success
  //   return { success: true, verificationToken };
  // } catch (error) {
  //   console.error("Registration error:", error);
  //   return { error: "Registration failed" };
  // }
}

export async function verifyEmail(token: string) {
  // try {
  //   const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  //   await db
  //     .updateTable("users")
  //     .set({ email_verified: true })
  //     .where("id", "=", decoded.userId)
  //     .execute();
  //   return { success: true };
  // } catch (error) {
  //   console.error("Verification error:", error);
  //   return { error: "Verification failed" };
  // }
}

export async function getCurrentUser() {
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
}

export async function logout() {
  cookies().delete("auth-token");
  return { success: true };
}
