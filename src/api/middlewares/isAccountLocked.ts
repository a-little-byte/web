import type { PrivateContextVariables } from "@/api/types";
import { emailValidator } from "@/lib/validators";
import type { MiddlewareHandler } from "hono";
import { z } from "zod";

const loginAttemptBodyValidator = z.object({
  email: emailValidator,
});

export const isAccountLockedMiddleware: MiddlewareHandler<{
  Variables: PrivateContextVariables;
}> = async ({ var: { db }, req, json }, next) => {
  const body = await loginAttemptBodyValidator.parseAsync(await req.json());
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
