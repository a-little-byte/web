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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { useQuery } from "@/hooks/useQuery";
import { apiClient } from "@/lib/apiClient";
import { useTranslations } from "next-intl";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileTab = () => {
  const { data: user, isLoading, isSuccess } = useQuery(apiClient.account);
  const t = useTranslations("dashboard.settings.profile");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <ProfileFormSkeleton />}
        {isSuccess && <ProfileForm user={user} />}
      </CardContent>
    </Card>
  );
};

const ProfileFormSkeleton = () => {
  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <Skeleton className="h-10 w-[120px]" />
    </>
  );
};

const ProfileForm = ({
  user,
}: {
  user: { first_name: string; last_name: string; email: string };
}) => {
  const t = useTranslations("dashboard.settings.profile");
  const { toast } = useToast();

  const profileForm = useForm<ProfileFormValues>(profileSchema, {
    defaultValues: {
      firstName: user?.first_name,
      lastName: user?.last_name,
      email: user?.email,
    },
  });

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
    <Form form={profileForm} onSubmit={onProfileSubmit}>
      <div className="flex flex-col gap-4 mb-4">
        <InputField
          control={profileForm.control}
          name="firstName"
          label={t("form.firstName.label")}
          placeholder={t("form.firstName.placeholder")}
          disabled={profileForm.formState.isSubmitting}
        />

        <InputField
          control={profileForm.control}
          name="lastName"
          label={t("form.lastName.label")}
          placeholder={t("form.lastName.placeholder")}
          disabled={profileForm.formState.isSubmitting}
        />

        <InputField
          control={profileForm.control}
          name="email"
          label={t("form.email.label")}
          placeholder={t("form.email.placeholder")}
        />
      </div>

      <Button type="submit" disabled={profileForm.formState.isSubmitting}>
        {t("form.submit")}
      </Button>
    </Form>
  );
};
