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
import { useToast } from "@/hooks/use-toast";
import { Link } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

const resetPasswordFormSchema = z.object({
  password: z.string().min(4),
  confirmPassword: z.string().min(4),
});

export default function ResetPassword() {
  const t = useTranslations("auth.resetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<
    z.input<typeof resetPasswordFormSchema>,
    unknown,
    z.output<typeof resetPasswordFormSchema>
  >({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error(t("errors.passwordsMismatch"));
      }

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password: data.password }),
      });

      const responseData = await response.json();

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      toast({
        title: t("success.title"),
        description: t("success.description"),
      });

      router.push("/login");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: t("errors.title"),
        description:
          error instanceof Error ? error.message : t("errors.default"),
        variant: "destructive",
      });
    }
  };

  if (!token) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{t("invalidLink.title")}</CardTitle>
            <CardDescription>{t("invalidLink.description")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/forgot-password">{t("invalidLink.requestNew")}</Link>
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
          <CardTitle className="text-2xl">{t("form.title")}</CardTitle>
          <CardDescription>{t("form.description")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Input
                {...register("password", {
                  required: t("validation.passwordRequired"),
                })}
                type="password"
                placeholder={t("form.passwordPlaceholder")}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Input
                {...register("confirmPassword", {
                  required: t("validation.confirmPasswordRequired"),
                })}
                type="password"
                placeholder={t("form.confirmPasswordPlaceholder")}
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("form.submitButton")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
