import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { authenticator } from "otplib";
import QRCode from "qrcode";

export async function POST(request: Request) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Generate TOTP secret
    const secret = authenticator.generateSecret();

    // Generate otpauth URL
    const otpauth = authenticator.keyuri(
      session.user.email!,
      "Cyna Security",
      secret
    );

    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpauth);

    // Store secret temporarily (it will be confirmed after user verifies)
    await supabase.from("totp_temp").upsert({
      user_id: session.user.id,
      secret,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ secret, qrCode });
  } catch (error) {
    console.error("TOTP setup error:", error);
    return NextResponse.json(
      { error: "Failed to setup TOTP" },
      { status: 500 }
    );
  }
}
