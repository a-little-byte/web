import { PrivateContextVariables } from "@/api/types";
import { UnauthorizedPublicError } from "@/errors";
import { MiddlewareHandler } from "hono";
import { getSignedCookie } from "hono/cookie";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { UUID } from "node:crypto";
import { apiConfig } from "../config";

export const authMiddleware: MiddlewareHandler<{
  Variables: PrivateContextVariables;
}> = async (ctx, next) => {
  const {
    set,
    var: { db },
  } = ctx;
  try {
    const token = await getSignedCookie(ctx, apiConfig.cookie, "auth-token");

    if (!token) {
      throw new UnauthorizedPublicError();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { userId: UUID };

    const session = await db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", decoded.userId)
      .executeTakeFirst();

    if (!session) {
      throw new UnauthorizedPublicError();
    }

    set("session", { user: session });

    await next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedPublicError();
    }

    throw error;
  }
};
