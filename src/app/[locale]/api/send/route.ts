import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, subject, message } = await request.json();

    const data = await resend.emails.send({
      from: 'Cyna <onboarding@resend.dev>',
      to: [email],
      subject: subject,
      html: `<div>
        <h1>${subject}</h1>
        <p>${message}</p>
      </div>`,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}