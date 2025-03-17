import { ContextVariables } from "@/api/types";
import { MiddlewareHandler } from "hono";
import jwt from "jsonwebtoken";
import { UUID } from "node:crypto";

export const authMiddleware: MiddlewareHandler<{
  Variables: ContextVariables;
}> = async ({ json, var: { db }, req }, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return json({ error: "Unauthorized" }, 401);
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
    return json({ error: "Unauthorized" }, 401);
  }

  return next();
};
