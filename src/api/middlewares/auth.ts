import { PrivateContextVariables } from "@/api/types";
import { MiddlewareHandler } from "hono";
import { getSignedCookie } from "hono/cookie";
import jwt from "jsonwebtoken";
import { UUID } from "node:crypto";
import { apiConfig } from "../config";

export const authMiddleware: MiddlewareHandler<{
  Variables: PrivateContextVariables;
}> = async (ctx, next) => {
  const {
    set,
    json,
    var: { db },
    req,
  } = ctx;
  const token = await getSignedCookie(ctx, apiConfig.cookie, "auth-token");

  if (!token) {
    return json({ error: "Unauthorized" }, 401);
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
  ) as { userId: UUID };

  const session = await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", decoded.userId)
    .executeTakeFirst();

  if (!session) {
    return json({ error: "Unauthorized" }, 401);
  }

  set("session", { user: session });

  return next();
};
