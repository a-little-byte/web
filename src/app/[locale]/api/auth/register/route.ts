import { createUser } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_URL;

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    const user = await createUser({
      email,
      password,
      full_name: fullName,
      email_verified: false,
    });

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    // Send verification email
    await resend.emails.send({
      from: "Cyna <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your email address",
      html: `
        <div>
          <h1>Welcome to Cyna</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${baseUrl}/auth/confirm?token=${verificationToken}">Verify Email</a>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
