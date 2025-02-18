"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const SecuritySettings = () => {
  const t = useTranslations("dashboard.settings.security");
  const [isLoading, setIsLoading] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    checkTOTPStatus();
  }, []);

  async function checkTOTPStatus() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("totp_secrets")
        .select("enabled")
        .eq("user_id", session.user.id)
        .single();

      setTotpEnabled(!!data?.enabled);
    } catch (error) {
      toast({
        title: t("toasts.error.title"),
        description: t("toasts.error.description"),
        variant: "destructive",
      });
    }
  }

  async function setupTOTP() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/totp/setup", {
        method: "POST",
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setQrCode(data.qrCode);
    } catch (error) {
      toast({
        title: t("toasts.setupError.title"),
        description: t("toasts.setupError.description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyTOTP(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/totp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationCode }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setTotpEnabled(true);
      setQrCode(null);
      setVerificationCode("");

      toast({
        title: t("toasts.verifySuccess.title"),
        description: t("toasts.verifySuccess.description"),
      });
    } catch (error) {
      toast({
        title: t("toasts.verifyError.title"),
        description: t("toasts.verifyError.description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("twoFactor.title")}</CardTitle>
          <CardDescription>{t("twoFactor.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {totpEnabled ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                {t("twoFactor.enabled")}
              </p>
            </div>
          ) : qrCode ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {t("twoFactor.scanQR")}
              </p>
              <form onSubmit={verifyTOTP} className="space-y-4">
                <div>
                  <Input
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder={t("twoFactor.verificationCode.placeholder")}
                    maxLength={6}
                    className="text-center"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("twoFactor.buttons.verify")}
                </Button>
              </form>
            </div>
          ) : (
            <Button onClick={setupTOTP} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("twoFactor.buttons.enable")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
