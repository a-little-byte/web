import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Check if user exists
    const user = await db
      .selectFrom("users")
      .where("email", "=", email)
      .selectAll()
      .executeTakeFirst();

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send reset email
    await resend.emails.send({
      from: "Cyna <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your password",
      html: `
        <div>
          <h1>Reset Your Password</h1>
          <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
          <a href="${process.env.NEXT_PUBLIC_URL}/reset-password?token=${resetToken}">
            Reset Password
          </a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset" },
      { status: 500 }
    );
  }
}
