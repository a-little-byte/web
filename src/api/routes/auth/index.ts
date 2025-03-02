import { db } from "@/db";
import { verifyEmail } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { UUID } from "crypto";
import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { authTotpRouter } from "./totp";

const resend = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authRouter = new Hono()
  .get("/callback", async (c) => {
    const url = new URL(c.req.url);
    const origin = url.origin;
    const redirectTo = url.searchParams.get("redirect_to")?.toString();

    if (redirectTo) {
      return c.redirect(`${origin}${redirectTo}`);
    }

    return c.redirect(`${origin}/dashboard`);
  })
  .post("/forgot-password", async (c) => {
    try {
      const { email } = await c.req.json();

      const user = await db
        .selectFrom("users")
        .where("email", "=", email)
        .selectAll()
        .executeTakeFirst();

      if (!user) {
        return c.json({ success: true });
      }

      const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

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

      return c.json({ success: true });
    } catch (error) {
      console.error("Password reset error:", error);
      return c.json({ error: "Failed to process password reset" }, 500);
    }
  })
  .post("/reset-password", async (c) => {
    try {
      const { token, password } = await c.req.json();
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: UUID };
      const hashedPassword = await bcrypt.hash(password, 10);

      await db
        .updateTable("users")
        .set({
          password: hashedPassword,
          updated_at: new Date(),
        })
        .where("id", "=", decoded.userId)
        .execute();

      return c.json({ success: true });
    } catch (error) {
      console.error("Password reset error:", error);
      return c.json({ error: "Failed to reset password" }, 500);
    }
  })
  .route("/totp", authTotpRouter)
  .post("/verify", async (c) => {
    try {
      const { token } = await c.req.json();

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as { userId: string };
      await verifyEmail(decoded.userId);

      return c.json({ success: true });
    } catch (error) {
      console.error("Verification error:", error);
      return c.json({ error: "Verification failed" }, 500);
    }
  });
