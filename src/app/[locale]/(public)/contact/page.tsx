"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<
    z.input<typeof contactFormSchema>,
    unknown,
    z.output<typeof contactFormSchema>
  >({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: z.output<typeof contactFormSchema>) => {
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          subject: `New Contact Form Submission from ${data.firstName} ${data.lastName}`,
          message: `
            Name: ${data.firstName} ${data.lastName}
            Company: ${data.company}
            Interest: ${data.interest}
            Message: ${data.message}
          `,
        }),
      });

      if (response.ok) {
        toast({
          title: t("toast.success.title"),
          description: t("toast.success.description"),
        });
        reset();
      } else {
        throw new Error("Failed to send message");
      }
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

          <form onSubmit={handleSubmit(onSubmit)} className="mt-16 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("form.firstName")}</Label>
                <Input {...register("firstName", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("form.lastName")}</Label>
                <Input {...register("lastName", { required: true })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("form.email")}</Label>
              <Input {...register("email", { required: true })} type="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">{t("form.company")}</Label>
              <Input {...register("company", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest">{t("form.interest.label")}</Label>
              <Select {...register("interest")}>
                <SelectTrigger>
                  <SelectValue placeholder={t("form.interest.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {["soc", "edr", "xdr", "other"].map((key) => (
                    <SelectItem value={key}>
                      {t(`form.interest.options.${key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t("form.message.label")}</Label>
              <Textarea
                {...register("message", { required: true })}
                placeholder={t("form.message.placeholder")}
                className="min-h-[150px]"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {t(`form.submit.${isSubmitting ? "sending" : "default"}`)}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
