import { MiddlewareHandler } from "hono";
import { PrivateContextVariables } from "../types";

export const isAccountLockedMiddleware: MiddlewareHandler<{
  Variables: PrivateContextVariables;
}> = async ({ var: {db}, req, json},next) => {
  const body = await req.parseBody() as {email: string}
  const lockStatus = await db
  .selectFrom("login_attempts")
  .where("email", "=", body.email)
  .where("is_locked", "=", true)
  .where("lock_expires_at", ">", new Date())
  .executeTakeFirst();

  if(lockStatus){
    return json({ error: "Account is temporarily locked. Try again later or reset your password." }, 403);
  }

  return next();
};
