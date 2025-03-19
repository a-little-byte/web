"use client";

import { Form } from "@/components/base/Form";
import { InputField } from "@/components/base/InputField";
import { SelectField } from "@/components/base/SelectField";
import { TextareaField } from "@/components/base/TextareaField";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { apiClient } from "@/lib/api";
import { useTranslations } from "next-intl";
import { z } from "zod";

const contactFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  company: z.string(),
  interest: z.string(),
  message: z.string(),
});

const Contact = () => {
  const t = useTranslations("contact");
  const { toast } = useToast();
  const form = useForm(contactFormSchema);
  const onSubmit = async (data: z.output<typeof contactFormSchema>) => {
    try {
      await apiClient.send.$post({
        json: {
          email: data.email,
          subject: `New Contact Form Submission from ${data.firstName} ${data.lastName}`,
          message: `
            Name: ${data.firstName} ${data.lastName}
            Company: ${data.company}
            Interest: ${data.interest}
            Message: ${data.message}
          `,
        },
      });

      toast({
        title: t("toast.success.title"),
        description: t("toast.success.description"),
      });
      form.reset();
    } catch (error) {
      toast({
        title: t("toast.error.title"),
        description: t("toast.error.description"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-center">
            {t("subtitle")}
          </p>

          <Form form={form} onSubmit={onSubmit} className="mt-16 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label={t("form.firstName")}
                control={form.control}
                name="firstName"
                placeholder={t("form.firstName")}
              />
              <InputField
                label={t("form.lastName")}
                control={form.control}
                name="lastName"
                placeholder={t("form.lastName")}
              />
            </div>

            <InputField
              label={t("form.email")}
              control={form.control}
              name="email"
              placeholder={t("form.email")}
            />

            <InputField
              label={t("form.company")}
              control={form.control}
              name="company"
              placeholder={t("form.company")}
            />

            <SelectField
              label={t("form.interest.label")}
              control={form.control}
              name="interest"
              placeholder={t("form.interest.placeholder")}
              options={["soc", "edr", "xdr", "other"].map((key) => ({
                label: t(`form.interest.options.${key}`),
                value: key,
              }))}
            />

            <TextareaField
              label={t("form.message.label")}
              control={form.control}
              name="message"
              placeholder={t("form.message.placeholder")}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {t(
                `form.submit.${form.formState.isSubmitting ? "sending" : "default"}`
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
