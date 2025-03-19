import { authTotpRouter } from "@/api/routes/auth/totp";
import { ContextVariables } from "@/api/types";
import { verifyEmail } from "@/lib/auth";
import { emailValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { Hono } from "hono";
import jwt from "jsonwebtoken";
import type { UUID } from "node:crypto";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authRouter = new Hono<{ Variables: ContextVariables }>()
  .get("/callback", async (c) => {
    const url = new URL(c.req.url);
    const origin = url.origin;
    const redirectTo = url.searchParams.get("redirect_to")?.toString();

    if (redirectTo) {
      return c.redirect(`${origin}${redirectTo}`);
    }

    return c.redirect(`${origin}/dashboard`);
  })
  .post(
    "/forgot-password",
    zValidator("json", z.object({ email: emailValidator })),
    async ({ var: { db }, req, json }) => {
      try {
        const { email } = req.valid("json");

        const user = await db
          .selectFrom("users")
          .where("email", "=", email)
          .selectAll()
          .executeTakeFirst();

        if (!user) {
          return json({ success: true });
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

        return json({ success: true });
      } catch (error) {
        console.error("Password reset error:", error);
        return json({ error: "Failed to process password reset" }, 500);
      }
    }
  )
  .post(
    "/reset-password",
    zValidator("json", z.object({ token: z.string(), password: z.string() })),
    async ({ var: { db }, req, json }) => {
      const { token, password } = req.valid("json");
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: UUID };
      const hashedPassword = await bcrypt.hash(password, 10);

      await db
        .updateTable("users")
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where("id", "=", decoded.userId)
        .execute();

      return json({ success: true });
    }
  )
  .post("/verify", async (c) => {
    const { token } = await c.req.json();

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { userId: UUID };
    await verifyEmail(decoded.userId);

    return c.json({ success: true });
  })
  .post(
    "/sign-in",
    zValidator(
      "json",
      z.object({ email: emailValidator, password: z.string() })
    ),
    async ({ var: { db }, req, json }) => {
      const { email, password } = req.valid("json");

      const user = await db
        .selectFrom("users")
        .where("email", "=", email)
        .selectAll()
        .executeTakeFirst();

      if (!user) {
        return json({ error: "Invalid credentials" }, 401);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return json({ error: "Invalid credentials" }, 401);
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "24h",
      });

      return json({ success: true, token });
    }
  )
  .post(
    "/sign-up",
    zValidator(
      "json",
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        first_name: z.string().min(1),
        last_name: z.string().min(1),
      })
    ),
    async ({ var: { db }, req, json }) => {
      try {
        const { email, password, first_name, last_name } = req.valid("json");

        const existingUser = await db
          .selectFrom("users")
          .where("email", "=", email)
          .selectAll()
          .executeTakeFirst();

        if (existingUser) {
          return json({ error: "User already exists" }, 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db
          .insertInto("users")
          .values({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            email_verified: false,
            role: "user",
          })
          .returning(["id", "email", "first_name", "last_name", "createdAt"])
          .executeTakeFirstOrThrow();
        const verificationToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
          expiresIn: "24h",
        });

        await resend.emails.send({
          from: "Cyna <onboarding@resend.dev>",
          to: [email],
          subject: "Verify your email",
          html: `
        <div>
          <h1>Verify Your Email</h1>
          <p>Click the link below to verify your email address. This link will expire in 24 hours.</p>
          <a href="${process.env.NEXT_PUBLIC_URL}/auth/callback?token=${verificationToken}">
            Verify Email
          </a>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
        });

        return json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            createdAt: user.createdAt,
          },
        });
      } catch (error) {
        console.error("Sign-up error:", error);
        return json({ error: "Failed to create account" }, 500);
      }
    }
  )
  .route("/totp", authTotpRouter);
