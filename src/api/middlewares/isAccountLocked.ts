import type { PrivateContextVariables } from "@/api/types";
import { ForbiddenPublicError } from "@/errors";
import type { MiddlewareHandler } from "hono";

export const isAccountLockedMiddleware: MiddlewareHandler<
  {
    Variables: PrivateContextVariables;
  },
  "/auth/sign-in",
  { out: { json: { email: string } } }
> = async ({ var: { db }, req }, next) => {
  const body = req.valid("json");
  const lockStatus = await db
    .selectFrom("login_attempts")
    .where("email", "=", body.email)
    .where("is_locked", "=", true)
    .where("lock_expires_at", ">", new Date())
    .executeTakeFirst();

  if (lockStatus) {
    throw new ForbiddenPublicError(
      "Account is temporarily locked. Try again later or reset your password.",
    );
  }

  await next();
};
