"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

const totpSchema = z.object({
  code: z.string().length(6),
});

type LoginFormData = z.infer<typeof loginSchema>;
type TOTPFormData = z.infer<typeof totpSchema>;

export default function Login() {
  const t = useTranslations("auth.login");
  const tTotp = useTranslations("auth.totp");
  const [isLoading, setIsLoading] = useState(false);
  const [showTOTP, setShowTOTP] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/dashboard";
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const totpForm = useForm<TOTPFormData>({
    resolver: zodResolver(totpSchema),
  });

  async function onLoginSubmit(data: LoginFormData) {
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

        document.cookie = `auth-token=${authData.session.access_token}`;
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
          <form onSubmit={totpForm.handleSubmit((data) => console.log(data))}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">{tTotp("codeLabel")}</Label>
                <Input
                  {...totpForm.register("code")}
                  id="code"
                  placeholder={tTotp("codePlaceholder")}
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
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
          </form>
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
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                {...loginForm.register("email")}
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t("passwordLabel")}</Label>
              <Input
                {...loginForm.register("password")}
                id="password"
                type="password"
                disabled={isLoading}
              />
            </div>
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
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
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
        </form>
      </Card>
    </div>
  );
}
