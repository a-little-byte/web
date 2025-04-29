import { checkPermissions } from "@/api/middlewares/checkPermissions";
import { PrivateContextVariables } from "@/api/types";
import { emailValidator, idValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const usersRouter = new Hono<{ Variables: PrivateContextVariables }>()
  .get("/", checkPermissions("users.read"), async ({ var: { db }, json }) => {
    const users = await db
      .selectFrom("users")
      .select([
        "id",
        "email",
        "first_name",
        "last_name",
        "role",
        "email_verified",
        "createdAt",
        "updatedAt",
      ])
      .orderBy("createdAt", "desc")
      .execute();

    return json(users);
  })
  .get(
    "/:id",
    checkPermissions("users.read"),
    zValidator("param", z.object({ id: idValidator })),
    async ({ var: { db }, json, req }) => {
      const { id } = req.valid("param");

      const user = await db
        .selectFrom("users")
        .where("id", "=", id)
        .select([
          "id",
          "email",
          "first_name",
          "last_name",
          "role",
          "email_verified",
          "createdAt",
          "updatedAt",
        ])
        .executeTakeFirst();

      if (!user) {
        return json({ error: "User not found" }, 404);
      }

      return json(user);
    }
  )
  .patch(
    "/:id",
    checkPermissions("users.update"),
    zValidator("param", z.object({ id: idValidator })),
    zValidator(
      "json",
      z.object({
        first_name: z.string().min(1).optional(),
        last_name: z.string().min(1).optional(),
        email: emailValidator.optional(),
        role: z.enum(["admin", "user"]).optional(),
      })
    ),
    async ({ var: { db }, json, req }) => {
      const { id } = req.valid("param");
      const data = req.valid("json");

      const updatedUser = await db
        .updateTable("users")
        .set(data)
        .where("id", "=", id)
        .returning([
          "id",
          "email",
          "first_name",
          "last_name",
          "role",
          "email_verified",
          "createdAt",
          "updatedAt",
        ])
        .executeTakeFirst();

      if (!updatedUser) {
        return json({ error: "User not found" }, 404);
      }

      return json(updatedUser);
    }
  )
  .delete(
    "/:id",
    checkPermissions("users.delete"),
    zValidator("param", z.object({ id: idValidator })),
    async ({ var: { db }, json, req }) => {
      const { id } = req.valid("param");
      const adminCount = await db
        .selectFrom("users")
        .where("role", "=", "admin")
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst();

      const userToDelete = await db
        .selectFrom("users")
        .where("id", "=", id)
        .select("role")
        .executeTakeFirst();

      if (
        userToDelete?.role === "admin" &&
        adminCount &&
        Number(adminCount.count) <= 1
      ) {
        return json({ error: "Cannot delete the last admin user" }, 400);
      }

      await db.deleteFrom("users").where("id", "=", id).execute();

      return json({});
    }
  );
