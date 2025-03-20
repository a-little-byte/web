import { ContextVariables } from "@/api/types";
import { MiddlewareHandler } from "hono";

export const adminMiddleware: MiddlewareHandler<{
  Variables: ContextVariables;
}> = async ({ json, var: { session } }, next) => {
  if (session?.user.role !== "admin") {
    return json({ error: "Unauthorized" }, 401);
  }

  return next();
};
