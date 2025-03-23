import { authMiddleware } from "@/api/middlewares/auth";
import type {
  PrivateContextVariables,
  PublicContextVariables,
} from "@/api/types";
import { emailValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { z } from "zod";

export const authTotpRouter = new Hono<{ Variables: PublicContextVariables }>()
  .post(
    "/validate",
    zValidator("json", z.object({ email: emailValidator, token: z.string() })),
    async ({ var: { db }, json, req }) => {
      const { email, token } = req.valid("json");
      const userData = await db
        .selectFrom("users")
        .select("id")
        .where("email", "=", email)
        .executeTakeFirst();

      if (!userData) {
        return json({ error: "User not found" }, 404);
      }

      const totpData = await db
        .selectFrom("totp_secrets")
        .selectAll()
        .where("user_id", "=", userData.id)
        .executeTakeFirst();

      if (!totpData?.enabled) {
        return json({ error: "TOTP not enabled" }, 400);
      }

      const isValid = authenticator.verify({
        token,
        secret: totpData.secret,
      });

      if (!isValid) {
        return json({ error: "Invalid token" }, 400);
      }

      return json({ success: true });
    },
  )

  .route(
    "/",
    new Hono<{ Variables: PrivateContextVariables }>()
      .use(authMiddleware)
      .get("/status", async ({ var: { db, session }, json }) => {
        const totpData = await db
          .selectFrom("totp_secrets")
          .select("enabled")
          .where("user_id", "=", session.user.id)
          .executeTakeFirst();

        return json({ enabled: !!totpData?.enabled });
      })
      .post("/setup", async ({ var: { db, session }, json }) => {
        const secret = authenticator.generateSecret();
        const otpauth = authenticator.keyuri(
          session.user.email!,
          "Cyna Security",
          secret,
        );
        const qrCode = await QRCode.toDataURL(otpauth);

        await db
          .insertInto("totp_temp")
          .values({
            user_id: session.user.id,
            secret,
          })
          .execute();

        return json({ secret, qrCode });
      })
      .post(
        "/verify",
        zValidator("json", z.object({ token: z.string() })),
        async ({ var: { db, session }, json, req }) => {
          const { token } = req.valid("json");

          const tempData = await db
            .selectFrom("totp_temp")
            .select("secret")
            .where("user_id", "=", session.user.id)
            .executeTakeFirst();

          if (!tempData?.secret) {
            return json({ error: "TOTP not set up" }, 400);
          }

          const isValid = authenticator.verify({
            token,
            secret: tempData.secret,
          });

          if (!isValid) {
            return json({ error: "Invalid token" }, 400);
          }

          await db
            .insertInto("totp_secrets")
            .values({
              user_id: session.user.id,
              secret: tempData.secret,
              enabled: true,
            })
            .execute();

          await db
            .deleteFrom("totp_temp")
            .where("user_id", "=", session.user.id)
            .execute();

          return json({ success: true });
        },
      ),
  );
