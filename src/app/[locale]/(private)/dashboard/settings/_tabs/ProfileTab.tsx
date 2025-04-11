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
import { apiClient } from "@/lib/apiClient";
import { useTranslations } from "next-intl";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileTab = () => {
  const t = useTranslations("dashboard.settings.profile");
  const { toast } = useToast();
  const profileForm = useForm(profileSchema);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      await apiClient.account.$patch({
        json: data,
      });

      toast({
        title: t("toasts.success.title"),
        description: t("toasts.success.description"),
      });
    } catch (error) {
      toast({
        title: t("toasts.error.title"),
        description: t("toasts.error.description"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={profileForm} onSubmit={onProfileSubmit}>
          <div className="flex flex-col gap-4 mb-4">
            <InputField
              control={profileForm.control}
              name="fullName"
              label={t("form.fullName.label")}
              placeholder={t("form.fullName.placeholder")}
              disabled={profileForm.formState.isSubmitting}
            />
            <InputField
              control={profileForm.control}
              name="email"
              label={t("form.email.label")}
              placeholder={t("form.email.placeholder")}
              disabled={profileForm.formState.isSubmitting}
            />
          </div>

          <Button type="submit" disabled={profileForm.formState.isSubmitting}>
            {t("form.submit")}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
};
