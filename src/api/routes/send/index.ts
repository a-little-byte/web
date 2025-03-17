import type { ContextVariables } from "@/api/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const sendRouter = new Hono<{ Variables: ContextVariables }>().post(
  "/",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      subject: z.string(),
      message: z.string(),
    })
  ),
  async ({ req, var: { resend }, json }) => {
    const { email, subject, message } = req.valid("json");

    const data = await resend.emails.send({
      from: "Cyna <onboarding@resend.dev>",
      to: [email],
      subject,
      html: `<div>
        <h1>${subject}</h1>
        <p>${message}</p>
      </div>`,
    });

    return json(data);
  }
);
