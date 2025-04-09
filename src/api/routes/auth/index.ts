import { Hash, Verify } from "@/api/c/hash";
import { apiConfig } from "@/api/config";
import { isAccountLockedMiddleware } from "@/api/middlewares/isAccountLocked";
import { authTotpRouter } from "@/api/routes/auth/totp";
import { PublicContextVariables } from "@/api/types";
import { Database } from "@/db";
import { verifyEmail } from "@/lib/auth";
import { emailValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { setSignedCookie } from "hono/cookie";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import { Kysely } from "kysely";
import type { UUID } from "node:crypto";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const UNIX_TIME_VARIABLE = 1000;
const MINUTES = 60;
const HOURS = 24;

const LOGINATTEMPTS_LAST = 15; // in minutes
const LOGINATTEMPTS_LOCK = 60; // in minutes
const ACCSESSTOKEN_EXPIRES_IN = 15; // in minutes
const REFRESHTOKEN_EXPIRES_IN = 7; // in days

const recordFailedLoginAttempt = async (
  db: Kysely<Database>,
  email: string,
  ip: string,
) => {
  const now = new Date();

  await db
    .insertInto("login_attempts")
    .values({
      email,
      ip_address: ip,
    })
    .execute();

  const failedAttempts = await db
    .selectFrom("login_attempts")
    .where("email", "=", email)
    .where(
      "attempted_at",
      ">",
      new Date(
        now.getTime() - LOGINATTEMPTS_LAST * MINUTES * UNIX_TIME_VARIABLE,
      ),
    ) // Last 15 minutes
    .select(db.fn.count("id").as("count"))
    .executeTakeFirst();

  if (failedAttempts && Number(failedAttempts.count) >= 5) {
    await db
      .updateTable("login_attempts")
      .set({
        is_locked: true,
        lock_expires_at: new Date(
          now.getTime() + LOGINATTEMPTS_LOCK * MINUTES * UNIX_TIME_VARIABLE,
        ), // Lock for 1 hour
      })
      .where("email", "=", email)
      .execute();
  }
};

const deleteUnlockedAccount = (db: Kysely<Database>, email: string) =>
  db.deleteFrom("login_attempts").where("email", "=", email).execute();

const createSignedCookie = (
  ctx: Context,
  name: string,
  value: string,
  path: string,
  expiresIn: number,
) =>
  setSignedCookie(ctx, name, value, apiConfig.cookie, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: expiresIn,
    path: path,
  });

export const authRouter = new Hono<{ Variables: PublicContextVariables }>()
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
    async ({ var: { db, resend }, req, json }) => {
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
          from: "Cyna <no-reply@limerio.dev>",
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
    },
  )
  .post(
    "/reset-password",
    zValidator("json", z.object({ token: z.string(), password: z.string() })),
    async ({ var: { db }, req, json }) => {
      const { token, password } = req.valid("json");
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: UUID };
      const { hash, salt } = await Hash(password, apiConfig.pepper);

      await db
        .updateTable("users")
        .set({
          password: hash,
          password_salt: salt,
        })
        .where("id", "=", decoded.userId)
        .execute();

      return json({ success: true });
    },
  )
  .post("/verify", async (c) => {
    const { token } = await c.req.json();

    const verification = await c.var.db
      .selectFrom("verification")
      .where("email_token", "=", token)
      .where("email_token_time", ">", new Date())
      .select(["email_token", "user_id"])
      .executeTakeFirst();

    if (!verification) {
      c.json({ success: false }, 500);
      return;
    }

    await verifyEmail(verification.user_id);

    return c.json({ success: true });
  })
  .post(
    "/sign-in",
    zValidator(
      "json",
      z.object({ email: emailValidator, password: z.string() }),
    ),
    isAccountLockedMiddleware,
    async (ctx) => {
      const {
        var: { db },
        req,
        json,
      } = ctx;
      const { email, password } = req.valid("json");
      const clientIp = req.header("x-forwarded-for") || "unknown";

      const user = await db
        .selectFrom("users")
        .where("email", "=", email)
        .selectAll()
        .executeTakeFirst();

      if (!user) {
        return json({ error: "Invalid credentials" }, 401);
      }

      const isPasswordValid = await Verify(
        password,
        user.password,
        user.password_salt,
        apiConfig.pepper,
      );

      if (!isPasswordValid) {
        await recordFailedLoginAttempt(db, email, clientIp);
        return json({ error: "Invalid credentials" }, 401);
      }

      await deleteUnlockedAccount(db, email);
      const accessToken = jwt.sign(
        { userId: user.id, type: "accsess" },
        JWT_SECRET,
        {
          expiresIn: "24h",
        },
      );
      const refreshToken = jwt.sign(
        { userId: user.id, type: "refresh" },
        JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );

      await createSignedCookie(
        ctx,
        "auth-token",
        accessToken,
        "/",
        ACCSESSTOKEN_EXPIRES_IN * MINUTES * UNIX_TIME_VARIABLE,
      );
      await createSignedCookie(
        ctx,
        "refresh-token",
        refreshToken,
        "/",
        REFRESHTOKEN_EXPIRES_IN * HOURS * MINUTES * UNIX_TIME_VARIABLE,
      );

      return json({ success: true, email_verified: user.email_verified });
    },
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
      }),
    ),
    async ({ var: { db, resend }, req, json }) => {
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

        const emailVerificationToken = randomBytes(32).toString("hex");
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const { hash, salt } = await Hash(password, apiConfig.pepper);
        const user = await db
          .insertInto("users")
          .values({
            email,
            password: hash,
            password_salt: salt,
            first_name,
            last_name,
            role: "user",
          })
          .returning(["id", "email", "first_name", "last_name", "createdAt"])
          .executeTakeFirstOrThrow();

        await db
          .insertInto("verification")
          .values({
            user_id: user.id,
            email_token: emailVerificationToken,
            email_token_time: tokenExpiry,
          })
          .execute();

        await resend.emails.send({
          from: "Cyna <no-reply@limerio.dev>",
          to: [email],
          subject: "Verify your email - Cyna",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Welcome to Cyna!</h1>
              <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
              <div style="margin: 20px 0;">
                <a href="${process.env.NEXT_PUBLIC_URL}/auth/confirm?token=${emailVerificationToken}" 
                   style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  Verify Email Address
                </a>
              </div>
              <p>This verification link will expire in 24 hours.</p>
              <p>If you didn't create an account with us, please ignore this email.</p>
              <hr style="margin: 20px 0; border: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
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
    },
  )
  .route("/totp", authTotpRouter);
