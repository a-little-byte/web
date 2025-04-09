"use client";

import { Form } from "@/components/base/Form";
import { InputField } from "@/components/base/InputField";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "@/lib/i18n/routing";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

const resetPasswordFormSchema = z.object({
  password: z.string().min(4),
  confirmPassword: z.string().min(4),
});

export const ResetPasswordForm = () => {
  const t = useTranslations("auth.resetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const form = useForm(resetPasswordFormSchema);

  const onSubmit = async (data: z.infer<typeof resetPasswordFormSchema>) => {
    try {
      if (!token) {
        throw new Error(t("errors.invalidLink"));
      }

      if (data.password !== data.confirmPassword) {
        throw new Error(t("errors.passwordsMismatch"));
      }

      await apiClient.auth["reset-password"].$post({
        json: { token, password: data.password },
      });

      toast({
        title: t("success.title"),
        description: t("success.description"),
      });

      router.push("/login");
    } catch (error) {
      toast({
        title: t("errors.title"),
        description:
          error instanceof Error ? error.message : t("errors.default"),
        variant: "destructive",
      });
    }
  };

  return (
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
  );
};
