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
import { apiClient } from "@/lib/apiClient";
import { Link, useRouter } from "@/lib/i18n/routing";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

const totpSchema = z.object({
  code: z.string().length(6),
});

const TOTPVerification = ({ 
  onSubmit, 
  onBack, 
  isLoading, 
  tTotp 
}: { 
  onSubmit: (data: { code: string }) => void;
  onBack: () => void;
  isLoading: boolean;
  tTotp: (key: string) => string; 
}) => {
  const form = useForm(totpSchema);

  const handleSubmit: SubmitHandler<z.infer<typeof totpSchema>> = async (data) => {
    onSubmit(data);
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{tTotp("title")}</CardTitle>
          <CardDescription>{tTotp("description")}</CardDescription>
        </CardHeader>
        <Form form={form} onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <InputField
              control={form.control}
              name="code"
              label={tTotp("codeLabel")}
              placeholder={tTotp("codePlaceholder")}
              autoComplete="off"
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
              onClick={onBack}
              disabled={isLoading}
              type="button"
            >
              {tTotp("backButton")}
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
};

const Login = () => {
  const t = useTranslations("auth.login");
  const tTotp = useTranslations("auth.totp");
  const [isLoading, setIsLoading] = useState(false);
  const [showTOTP, setShowTOTP] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [tokens, setTokens] = useState({ accessToken: "", refreshToken: "" });
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/dashboard";
  const { toast } = useToast();
  const loginForm = useForm(loginSchema);

  const completeAuthentication = (data :{accessToken: string, refreshToken: string}) => {
    document.cookie = `auth-token=${data.accessToken}; path=/`;
    document.cookie = `refresh-token=${data.refreshToken}; path=/`;
    
    toast({
      title: t("toasts.loginSuccess.title"),
      description: t("toasts.loginSuccess.description"),
    });
     
    router.push(returnTo);
  };

  const onLoginSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    setIsLoading(true);

    try {
      const response = await apiClient.auth["sign-in"].$post({
        json: data,
      });

      const authData = await response.json();

      if ("error" in authData) {
        throw new Error(authData.error);
      }

      if (authData.user) {
        if (!authData.user.email_verified) {
          toast({
            title: t("toasts.emailNotVerified.title"),
            description: t("toasts.emailNotVerified.description"),
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      setTokens({accessToken: authData.acsessToken, refreshToken: authData.refreshToken});
      
      try {
        const totpStatusResponse = await apiClient.auth.totp.status.$get(
          {},
          {
          headers: {
            Authorization: `Bearer ${authData.acsessToken}`
          }
        });
        const totpStatus = await totpStatusResponse.json();
        
        if (totpStatus.enabled) {
          setUserEmail(data.email);
          setShowTOTP(true);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log("TOTP status check failed or not enabled");
      }

      completeAuthentication(tokens);
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
  };

  const handleTOTPSubmit: SubmitHandler<z.infer<typeof totpSchema>> = async (data) => {
    setIsLoading(true);
    
    try {
      const response = await apiClient.auth.totp.validate.$post({
        json: {
          email: userEmail,
          code: data.code
        }
      }, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`
        }
      });
      
      const totpData = await response.json();
      
      if ("error" in totpData) {
        throw new Error(totpData.error);
      }
      
      if (totpData.success) {
        completeAuthentication(tokens);
      }
    } catch (error) {
      console.error("TOTP Error:", error);
      toast({
        title: tTotp("toasts.error.title"),
        description: tTotp("toasts.error.description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowTOTP(false);
    setIsLoading(false);
  };

  if (showTOTP) {
    return (
      <TOTPVerification 
        onSubmit={handleTOTPSubmit} 
        onBack={handleBackToLogin} 
        isLoading={isLoading}
        tTotp={tTotp}
      />
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
