import type { PrivateContextVariables } from "@/api/types";
import type { MiddlewareHandler } from "hono";

export const isAccountLockedMiddleware: MiddlewareHandler<
  {
    Variables: PrivateContextVariables;
  },
  "/auth/sign-in",
  { out: { json: { email: string } } }
> = async ({ var: { db }, req, json }, next) => {
  const body = req.valid("json");
  const lockStatus = await db
    .selectFrom("login_attempts")
    .where("email", "=", body.email)
    .where("is_locked", "=", true)
    .where("lock_expires_at", ">", new Date())
    .executeTakeFirst();

  if (lockStatus) {
    return json(
      {
        error:
          "Account is temporarily locked. Try again later or reset your password.",
      },
      403,
    );
  }

  return next();
};
