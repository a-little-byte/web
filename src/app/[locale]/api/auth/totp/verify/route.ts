import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { authenticator } from "otplib";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get temporary secret
    const { data: tempData } = await supabase
      .from("totp_temp")
      .select("secret")
      .eq("user_id", session.user.id)
      .single();

    if (!tempData?.secret) {
      return NextResponse.json({ error: "TOTP not set up" }, { status: 400 });
    }

    // Verify token
    const isValid = authenticator.verify({
      token,
      secret: tempData.secret,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // Move secret from temporary to permanent storage
    await supabase.from("totp_secrets").upsert({
      user_id: session.user.id,
      secret: tempData.secret,
      enabled: true,
    });

    // Delete temporary secret
    await supabase.from("totp_temp").delete().eq("user_id", session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("TOTP verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify TOTP" },
      { status: 500 }
    );
  }
}
