import type { PrivateContextVariables } from "@/api/types";
import type { Attribute } from "@/db/models/CasbinRule";
import type { Context, Next } from "hono";

export const checkPermissions =
  (attributes: Attribute) =>
  async (
    {
      json,
      var: { session, enforcer },
    }: Context<{ Variables: PrivateContextVariables }>,
    next: Next,
  ) => {
    try {
      const user = session.user;

      if (!user) {
        return json({ error: "Forbidden" }, 403);
      }

      const [resource, permission] = attributes.split(".");
      const permitted = await enforcer.enforce(user.id, resource, permission);

      if (!permitted) {
        return json({ error: "Forbidden" }, 403);
      }

      await next();
    } catch (error) {
      return json({ error: "Internal server error" }, 500);
    }
  };
