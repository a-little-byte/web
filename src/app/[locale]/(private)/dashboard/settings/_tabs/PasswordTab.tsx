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
import { PublicError } from "@/errors";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { apiClient } from "@/lib/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { z } from "zod";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const PasswordTab = () => {
  const t = useTranslations("dashboard.settings.password");
  const { toast } = useToast();
  const passwordForm = useForm(passwordSchema, {
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: changePasswordMutation, isPending } = useMutation<
    {},
    PublicError,
    { oldPassword: string; newPassword: string }
  >({
    mutationFn: (data) =>
      apiClient.account.password.$patch({
        json: data,
      }),
    onSuccess: () => {
      passwordForm.reset();

      toast({
        title: t("toasts.success.title"),
        description: t("toasts.success.description"),
      });
    },
    onError: () => {
      toast({
        title: t("toasts.error.title"),
        description: t("toasts.error.description"),
      });
    },
  });

  const onPasswordSubmit = (data: PasswordFormValues) =>
    changePasswordMutation(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={passwordForm} onSubmit={onPasswordSubmit}>
          <div className="flex flex-col gap-4 mb-4">
            <InputField
              control={passwordForm.control}
              name="oldPassword"
              label={t("form.oldPassword.label")}
              placeholder={t("form.oldPassword.placeholder")}
              disabled={isPending}
              type="password"
            />
            <InputField
              control={passwordForm.control}
              name="newPassword"
              label={t("form.newPassword.label")}
              placeholder={t("form.newPassword.placeholder")}
              disabled={isPending}
              type="password"
            />
            <InputField
              control={passwordForm.control}
              name="confirmPassword"
              label={t("form.confirmPassword.label")}
              placeholder={t("form.confirmPassword.placeholder")}
              disabled={isPending}
              type="password"
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {t("form.submit")}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
};
