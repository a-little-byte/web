"use client";

import { Form } from "@/components/base/Form";
import { InputField } from "@/components/base/InputField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { apiClient } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { z } from "zod";

const formSchema = z.object({
  verificationCode: z.string().min(6, {
    message: "Verification code must be 6 digits",
  }),
});

const SecuritySettings = () => {
  const supabase = createClient();
  const t = useTranslations("dashboard.settings.security");
  const [isLoading, setIsLoading] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm(formSchema);

  useEffect(() => {
    checkTOTPStatus();
  }, []);

  const checkTOTPStatus = async () => {
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
  };

  const setupTOTP = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.api.auth.totp.setup.$post({
        method: "POST",
      });

      const data = await response.json();
      if ("error" in data) throw new Error(data.error);

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
  };

  const verifyTOTP = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const response = await apiClient.api.auth.totp.verify.$post({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: values.verificationCode }),
      });

      const data = await response.json();
      if ("error" in data) throw new Error(data.error);

      setTotpEnabled(true);
      setQrCode(null);
      form.reset();

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
  };

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
              <Form form={form} onSubmit={verifyTOTP}>
                <div>
                  <InputField
                    control={form.control}
                    name="verificationCode"
                    label={t("twoFactor.verificationCode.label")}
                    placeholder={t("twoFactor.verificationCode.placeholder")}
                    maxLength={6}
                    className="text-center"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("twoFactor.buttons.verify")}
                </Button>
              </Form>
            </div>
          ) : (
            <Button onClick={setupTOTP} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("twoFactor.buttons.enable")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
