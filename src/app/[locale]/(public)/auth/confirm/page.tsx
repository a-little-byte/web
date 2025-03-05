"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/i18n/routing";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ConfirmEmail = () => {
  const t = useTranslations("auth.confirmEmail");
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const supabase = createClient();

  useEffect(() => {
    async function verifyEmail() {
      try {
        if (!token) throw new Error(t("error.noToken"));

        const { error } = await supabase
          .from("auth.users")
          .update({ email_verified: true })
          .eq("id", token);

        if (error) throw error;

        router.push("/auth/login");
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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => router.push("/auth/login")}>
          {t("buttons.returnToLogin")}
        </Button>
      </div>
    );
  }

  return null;
};

export default ConfirmEmail;
