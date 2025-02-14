import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await db
      .updateTable("users")
      .set({
        password: hashedPassword,
        updated_at: new Date(),
      })
      .where("id", "=", decoded.userId)
      .execute();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
