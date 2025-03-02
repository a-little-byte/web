import type { ContextVariables } from "@/api/types";
import { Hono } from "hono";

export const sendRouter = new Hono<{ Variables: ContextVariables }>().post(
  "/",
  async ({ req, var: { resend }, json }) => {
    try {
      const { email, subject, message } = await req.json();

      const data = await resend.emails.send({
        from: "Cyna <onboarding@resend.dev>",
        to: [email],
        subject: subject,
        html: `<div>
        <h1>${subject}</h1>
        <p>${message}</p>
      </div>`,
      });

      return json(data);
    } catch (error) {
      return json({ error: "Failed to send email" }, 500);
    }
  }
);
