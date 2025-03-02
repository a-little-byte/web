import { createServerClient } from "@/lib/supabase/server";
import { Hono } from "hono";
import { authenticator } from "otplib";
import QRCode from "qrcode";

export const authTotpRouter = new Hono()
  .post("/setup", async (c) => {
    try {
      const supabase = createServerClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        return c.json({ error: "Not authenticated" }, 401);
      }

      const secret = authenticator.generateSecret();
      const otpauth = authenticator.keyuri(
        session.user.email!,
        "Cyna Security",
        secret
      );
      const qrCode = await QRCode.toDataURL(otpauth);

      await supabase.from("totp_temp").upsert({
        user_id: session.user.id,
        secret,
        created_at: new Date().toISOString(),
      });

      return c.json({ secret, qrCode });
    } catch (error) {
      console.error("TOTP setup error:", error);
      return c.json({ error: "Failed to setup TOTP" }, 500);
    }
  })
  .post("/validate", async (c) => {
    try {
      const { email, token } = await c.req.json();
      const supabase = createServerClient();
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (!userData) {
        return c.json({ error: "User not found" }, 404);
      }

      const { data: totpData } = await supabase
        .from("totp_secrets")
        .select("secret, enabled")
        .eq("user_id", userData.id)
        .single();

      if (!totpData?.enabled) {
        return c.json({ error: "TOTP not enabled" }, 400);
      }

      const isValid = authenticator.verify({
        token,
        secret: totpData.secret,
      });

      if (!isValid) {
        return c.json({ error: "Invalid token" }, 400);
      }

      return c.json({ success: true });
    } catch (error) {
      console.error("TOTP validation error:", error);
      return c.json({ error: "Failed to validate TOTP" }, 500);
    }
  })
  .post("/verify", async (c) => {
    try {
      const { token } = await c.req.json();
      const supabase = createServerClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return c.json({ error: "Not authenticated" }, 401);
      }

      const { data: tempData } = await supabase
        .from("totp_temp")
        .select("secret")
        .eq("user_id", session.user.id)
        .single();

      if (!tempData?.secret) {
        return c.json({ error: "TOTP not set up" }, 400);
      }

      const isValid = authenticator.verify({
        token,
        secret: tempData.secret,
      });

      if (!isValid) {
        return c.json({ error: "Invalid token" }, 400);
      }

      await supabase.from("totp_secrets").upsert({
        user_id: session.user.id,
        secret: tempData.secret,
        enabled: true,
      });

      await supabase.from("totp_temp").delete().eq("user_id", session.user.id);

      return c.json({ success: true });
    } catch (error) {
      console.error("TOTP verification error:", error);
      return c.json({ error: "Failed to verify TOTP" }, 500);
    }
  });
