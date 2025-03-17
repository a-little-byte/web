"use client";

import { Form } from "@/components/base/Form";
import { InputField } from "@/components/base/InputField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { apiClient } from "@/lib/api";
import { Link } from "@/lib/i18n/routing";
import { emailValidator } from "@/lib/validators";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: emailValidator,
});
const ForgotPassword = () => {
  const t = useTranslations("forgotPassword");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const form = useForm(forgotPasswordSchema);

  const onSubmit: SubmitHandler<
    z.output<typeof forgotPasswordSchema>
  > = async ({ email }) => {
    setIsLoading(true);

    try {
      const response = await apiClient.auth["forgot-password"].$post({
        json: { email },
      });

      const data = await response.json();

      if ("error" in data) {
        throw new Error(data.error);
      }

      setEmailSent(true);
      toast({
        title: t("toasts.valid.title"),
        description: t("toasts.valid.description"),
      });
    } catch (error) {
      toast({
        title: t("toasts.error.title"),
        description: t("toasts.error.description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{t("emailSent.title")}</CardTitle>
            <CardDescription>{t("emailSent.description")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/login">{t("emailSent.returnToLogin")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <Form form={form} onSubmit={onSubmit}>
          <CardContent className="grid gap-4">
            <InputField
              control={form.control}
              name="email"
              label={t("email.label")}
              placeholder={t("email.placeholder")}
              disabled={isLoading}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("send")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("rememberPassword")}{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t("signInLink")}
              </Link>
            </p>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
