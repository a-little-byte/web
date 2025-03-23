import type { PrivateContextVariables } from "@/api/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const sendRouter = new Hono<{
  Variables: PrivateContextVariables;
}>().post(
  "/",
  zValidator(
    "json",
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      company: z.string(),
      interest: z.string(),
      message: z.string(),
    })
  ),
  async ({ req, var: { resend }, json }) => {
    const { firstName, lastName, email, company, interest, message } =
      req.valid("json");

    const data = await resend.emails.send({
      from: "Cyna <onboarding@cyna.io>",
      to: [email],
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: `<div>
          <h1>New Contact Form Submission</h1>
          <p>
            Name: ${firstName} ${lastName}
            Company: ${company}
            Interest: ${interest}
            Message: ${message}
          </p>
        </div>`,
    });

    return json(data);
  }
);
