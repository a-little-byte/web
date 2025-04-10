import type { PrivateContextVariables } from "@/api/types";
import type { Attribute } from "@/db/models/CasbinRule";
import { ForbiddenPublicError } from "@/errors";
import type { Context, Next } from "hono";

export const checkPermissions =
  (attributes: Attribute) =>
  async (
    {
      var: { session, enforcer },
    }: Context<{ Variables: PrivateContextVariables }>,
    next: Next
  ) => {
    const user = session.user;

    if (!user) {
      throw new ForbiddenPublicError();
    }

    const [resource, permission] = attributes.split(".");
    const permitted = await enforcer.enforce(user.id, resource, permission);

    if (!permitted) {
      throw new ForbiddenPublicError();
    }

    await next();
  };
