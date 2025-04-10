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
import { Link } from "@/lib/i18n/routing";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import * as z from "zod";

const formSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

const Register = () => {
  const t = useTranslations("auth.register");
  const tToast = useTranslations("auth.toast");
  const tEmailSent = useTranslations("auth.emailSent");
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const form = useForm(formSchema);

  const onSubmit = async (data: FormData) => {
    try {
      await apiClient.auth["sign-up"].$post({
        json: {
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
        },
      });

      setEmailSent(true);
      toast({
        title: tToast("success.title"),
        description: tToast("success.description"),
      });
    } catch (error) {
      toast({
        title: tToast("error.title"),
        description: tToast("error.description"),
        variant: "destructive",
      });
    }
  };

  if (emailSent) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{tEmailSent("title")}</CardTitle>
            <CardDescription>{tEmailSent("description")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/login">{tEmailSent("returnToLogin")}</Link>
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
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <Form form={form} onSubmit={onSubmit}>
          <CardContent className="grid gap-4">
            <InputField
              control={form.control}
              name="first_name"
              label={t("first_name.label")}
              placeholder={t("first_name.placeholder")}
            />
            <InputField
              control={form.control}
              name="last_name"
              label={t("last_name.label")}
              placeholder={t("last_name.placeholder")}
            />
            <InputField
              control={form.control}
              name="email"
              label={t("email.label")}
              placeholder={t("email.placeholder")}
            />
            <InputField
              control={form.control}
              name="password"
              type="password"
              label={t("password.label")}
              placeholder={t("password.placeholder")}
            />
            <InputField
              control={form.control}
              name="confirmPassword"
              type="password"
              label={t("confirmPassword.label")}
              placeholder={t("confirmPassword.placeholder")}
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
              {t("submit")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("loginLink")}{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t("loginText")}
              </Link>
            </p>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
