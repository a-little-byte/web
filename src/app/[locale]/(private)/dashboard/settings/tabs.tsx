"use client";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "@/lib/i18n/routing";
import { useTranslations } from "next-intl";
import { useState } from "react";
import * as z from "zod";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const profileForm = useForm(profileSchema);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const result = await apiClient.account.$patch({
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <FormField
              control={profileForm.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.fullName.label")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("form.fullName.placeholder")}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={profileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.email.label")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={t("form.email.placeholder")}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {t("form.submit")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export const PasswordTab = () => {
  const t = useTranslations("dashboard.settings.password");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const passwordForm = useForm(passwordSchema);

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <FormField
              control={passwordForm.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.oldPassword.label")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.newPassword.label")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.confirmPassword.label")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {t("form.submit")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export const DangerTab = () => {
  const t = useTranslations("dashboard.settings.danger");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAccountDeletion = async () => {
    setIsLoading(true);
    try {
      await apiClient.account.$delete();

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
    } finally {
      setIsLoading(false);
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
            <Button variant="destructive" disabled={isLoading}>
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
