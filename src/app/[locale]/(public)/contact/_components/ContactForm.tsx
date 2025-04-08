"use client";

import { Form } from "@/components/base/Form";
import { InputField } from "@/components/base/InputField";
import { SelectField } from "@/components/base/SelectField";
import { SubmitButton } from "@/components/base/SubmitButton";
import { TextareaField } from "@/components/base/TextareaField";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { apiClient } from "@/lib/apiClient";
import { emailValidator } from "@/lib/validators";
import { useTranslations } from "next-intl";
import { z } from "zod";

const contactFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: emailValidator,
  company: z.string(),
  interest: z.string(),
  message: z.string(),
});

export const ContactForm = () => {
  const t = useTranslations("contact");
  const { toast } = useToast();
  const form = useForm(contactFormSchema);
  const onSubmit = async (data: z.output<typeof contactFormSchema>) => {
    try {
      await apiClient.contact.$post({
        json: data,
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

      <SubmitButton ns="contact" />
    </Form>
  );
};
