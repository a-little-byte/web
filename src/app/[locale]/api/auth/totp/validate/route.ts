import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { authenticator } from "otplib";

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();
    const supabase = createServerClient();
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: totpData } = await supabase
      .from("totp_secrets")
      .select("secret, enabled")
      .eq("user_id", userData.id)
      .single();

    if (!totpData?.enabled) {
      return NextResponse.json({ error: "TOTP not enabled" }, { status: 400 });
    }

    const isValid = authenticator.verify({
      token,
      secret: totpData.secret,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("TOTP validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate TOTP" },
      { status: 500 }
    );
  }
}
