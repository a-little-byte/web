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
import { Link, useRouter } from "@/lib/i18n/routing";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

const totpSchema = z.object({
  code: z.string().length(6),
});

const Login = () => {
  const t = useTranslations("auth.login");
  const tTotp = useTranslations("auth.totp");
  const [isLoading, setIsLoading] = useState(false);
  const [showTOTP, setShowTOTP] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/dashboard";
  const { toast } = useToast();

  const loginForm = useForm(loginSchema);

  const totpForm = useForm(totpSchema);

  async function onLoginSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (authData.user) {
        if (!authData.user.email_confirmed_at) {
          toast({
            title: t("toasts.emailNotVerified.title"),
            description: t("toasts.emailNotVerified.description"),
            variant: "destructive",
          });
          return;
        }

        toast({
          title: t("toasts.loginSuccess.title"),
          description: t("toasts.loginSuccess.description"),
        });

        document.cookie = `auth-token=${authData.session.access_token}; refresh-token=${authData.session.refresh_token}`;
        router.push(returnTo);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: t("toasts.loginError.title"),
        description: t("toasts.loginError.description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (showTOTP) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{tTotp("title")}</CardTitle>
            <CardDescription>{tTotp("description")}</CardDescription>
          </CardHeader>
          <Form form={totpForm} onSubmit={(data) => console.log(data)}>
            <CardContent className="grid gap-4">
              <InputField
                control={totpForm.control}
                name="code"
                label={tTotp("codeLabel")}
                placeholder={tTotp("codePlaceholder")}
                disabled={isLoading}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {tTotp("verifyButton")}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowTOTP(false)}
                disabled={isLoading}
              >
                {tTotp("backButton")}
              </Button>
            </CardFooter>
          </Form>
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
        <Form form={loginForm} onSubmit={onLoginSubmit}>
          <CardContent className="grid gap-4">
            <InputField
              control={loginForm.control}
              name="email"
              label={t("emailLabel")}
              placeholder={t("emailPlaceholder")}
              disabled={isLoading}
            />
            <InputField
              control={loginForm.control}
              name="password"
              type="password"
              label={t("passwordLabel")}
              placeholder={t("passwordPlaceholder")}
              disabled={isLoading}
            />
            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {t("forgotPassword")}
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("signInButton")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("noAccount")}{" "}
              <Link
                href="/register"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t("signUpLink")}
              </Link>
            </p>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
