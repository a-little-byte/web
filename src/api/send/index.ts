import { Hono } from "hono";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const send = new Hono().post("/", async (c) => {
  try {
    const { email, subject, message } = await c.req.json();

    const data = await resend.emails.send({
      from: "Cyna <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: `<div>
        <h1>${subject}</h1>
        <p>${message}</p>
      </div>`,
    });

    return c.json(data);
  } catch (error) {
    return c.json({ error: "Failed to send email" }, 500);
  }
});
