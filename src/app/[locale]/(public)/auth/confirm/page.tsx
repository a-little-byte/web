"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmEmail() {
  const t = useTranslations("auth.confirmEmail");
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    async function verifyEmail() {
      try {
        if (!token) throw new Error(t("error.noToken"));

        const { error } = await supabase
          .from("auth.users")
          .update({ email_verified: true })
          .eq("id", token);

        if (error) throw error;

        router.push("/login");
      } catch (err) {
        console.error("Error verifying email:", err);
        setError(t("error.verificationFailed"));
      } finally {
        setIsVerifying(false);
      }
    }

    verifyEmail();
  }, [token, router, t]);

  if (isVerifying) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => router.push("/login")}>
          {t("buttons.returnToLogin")}
        </Button>
      </div>
    );
  }

  return null;
}
