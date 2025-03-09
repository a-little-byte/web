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
import { Link, useRouter } from "@/lib/i18n/routing";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

const resetPasswordFormSchema = z.object({
  password: z.string().min(4),
  confirmPassword: z.string().min(4),
});

const ResetPassword = () => {
  const t = useTranslations("auth.resetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const form = useForm(resetPasswordFormSchema);

  const onSubmit = async (data: z.infer<typeof resetPasswordFormSchema>) => {
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error(t("errors.passwordsMismatch"));
      }

      const response = await apiClient.auth["reset-password"].$post({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password: data.password }),
      });

      const responseData = await response.json();

      if ("error" in responseData) {
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
        <Form form={form} onSubmit={onSubmit}>
          <CardContent className="grid gap-4">
            <InputField
              control={form.control}
              name="password"
              label={t("form.passwordLabel")}
              placeholder={t("form.passwordPlaceholder")}
              disabled={form.formState.isSubmitting}
            />
            <InputField
              control={form.control}
              name="confirmPassword"
              label={t("form.confirmPasswordLabel")}
              placeholder={t("form.confirmPasswordPlaceholder")}
              disabled={form.formState.isSubmitting}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("form.submitButton")}
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
