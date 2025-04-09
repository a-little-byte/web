"use client";

import { Form } from "@/components/base/Form";
import { InputField } from "@/components/base/InputField";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { useRouter } from "@/lib/i18n/routing";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
});

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

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

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
          <Button type="submit" disabled={profileForm.formState.isSubmitting}>
            {t("form.submit")}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
};

export const PasswordTab = () => {
  const t = useTranslations("dashboard.settings.password");
  const { toast } = useToast();
  const passwordForm = useForm(passwordSchema);

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      await apiClient.account.password.$patch({
        json: {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
      });

      passwordForm.reset();

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
        <Form form={passwordForm} onSubmit={onPasswordSubmit}>
          <InputField
            control={passwordForm.control}
            name="oldPassword"
            label={t("form.oldPassword.label")}
            placeholder={t("form.oldPassword.placeholder")}
            disabled={passwordForm.formState.isSubmitting}
          />
          <InputField
            control={passwordForm.control}
            name="newPassword"
            label={t("form.newPassword.label")}
            placeholder={t("form.newPassword.placeholder")}
            disabled={passwordForm.formState.isSubmitting}
          />
          <InputField
            control={passwordForm.control}
            name="confirmPassword"
            label={t("form.confirmPassword.label")}
            placeholder={t("form.confirmPassword.placeholder")}
            disabled={passwordForm.formState.isSubmitting}
          />
          <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
            {t("form.submit")}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
};

export const DangerTab = () => {
  const t = useTranslations("dashboard.settings.danger");
  const { mutateAsync: accountDeletionMutation, isPending } = useMutation({
    mutationFn: () => apiClient.account.$delete(),
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleAccountDeletion = async () => {
    try {
      await accountDeletionMutation();

      router.push("/");

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
        <CardTitle className="text-destructive">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isPending}>
              {t("deleteAccount.button")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("deleteAccount.dialog.title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteAccount.dialog.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("deleteAccount.dialog.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleAccountDeletion}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("deleteAccount.dialog.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
