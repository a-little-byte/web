"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "@/lib/i18n/routing";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const ConfirmEmail = () => {
  const t = useTranslations("auth.confirmEmail");
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      setIsVerifying(true);

      try {
        if (!token) throw new Error(t("error.noToken"));

        await apiClient.auth.verify.$post({
          token,
        });

        router.push("/auth/login");
      } catch (err) {
        setError(t("error.verificationFailed"));
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token]);

  const handleReturnToLogin = useCallback(() => {
    router.push("/auth/login");
  }, []);

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
        <Button onClick={handleReturnToLogin}>
          {t("buttons.returnToLogin")}
        </Button>
      </div>
    );
  }

  return null;
};

export default ConfirmEmail;
