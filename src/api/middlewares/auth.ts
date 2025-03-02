import { ContextVariables } from "@/api/types";
import { MiddlewareHandler } from "hono";

export const authMiddleware: MiddlewareHandler<{
  Variables: ContextVariables;
}> = async ({ json, var: { db }, req }, next) => {
  const session = await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", req.header("Authorization"))
    .executeTakeFirst();

  if (!session) {
    return json({ error: "Unauthorized" }, 401);
  }
  return next();
};
