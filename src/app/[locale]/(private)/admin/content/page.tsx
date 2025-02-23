"use client";

import { Form } from "@/components/base/Form";
import { InputField } from "@/components/base/InputField";
import { TextareaField } from "@/components/base/TextareaField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { z } from "zod";

const heroSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  buttonText: z.string().min(1),
  buttonLink: z.string().min(1),
});

const basicSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

type HeroFormData = z.infer<typeof heroSchema>;
type BasicFormData = z.infer<typeof basicSchema>;

type ContentSectionProps = {
  value: "hero" | "features" | "cta";
  handleSubmit: (data: any) => void;
  validator: z.ZodSchema<{
    title: string;
    description: string;
  }>;
};

const ContentSection = ({
  value,
  handleSubmit,
  validator,
}: ContentSectionProps) => {
  const supabase = createClient();
  const t = useTranslations("admin.content");
  const form = useForm(validator);

  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>{t(`sections.${value}.title`)}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={handleSubmit}>
            <InputField
              control={form.control}
              name="title"
              label={t(`sections.${value}.form.title`)}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
            <TextareaField
              control={form.control}
              name="description"
              label={t(`sections.${value}.form.description`)}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
            <Button type="submit">{t("buttons.save")}</Button>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

type Tab = {
  value: ContentSectionProps["value"];
  validator: ContentSectionProps["validator"];
};

const tabs: Tab[] = [
  { value: "hero", validator: heroSchema },
  { value: "features", validator: basicSchema },
  { value: "cta", validator: basicSchema },
];

const ContentManagement = () => {
  const supabase = createClient();
  const [content, setContent] = useState<any[]>([]);
  const { toast } = useToast();
  const t = useTranslations("admin.content");

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .order("section");

      if (error) throw error;

      setContent(data);
    } catch (error) {
      toast({
        title: t("toasts.error.title"),
        description: t("toasts.error.fetchError"),
        variant: "destructive",
      });
    }
  };

  const handleSubmit =
    (section: ContentSectionProps["value"]) =>
    async (data: HeroFormData | BasicFormData) => {
      const contentData = {
        section,
        content: data,
      };

      const existing = content.find((c) => c.section === section);

      try {
        if (existing) {
          await supabase
            .from("page_content")
            .update(contentData)
            .eq("id", existing.id);
        } else {
          await supabase.from("page_content").insert(contentData).select();
        }

        toast({
          title: t("toasts.success.title"),
          description: t("toasts.success.description"),
        });

        fetchContent();
      } catch (error) {
        toast({
          title: t("toasts.error.title"),
          description: t("toasts.error.saveError"),
          variant: "destructive",
        });
      }
    };

  const getContentBySection = (section: string) => {
    return (content.find((c) => c.section === section)?.content as any) || {};
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">{t("sections.hero.title")}</TabsTrigger>
          <TabsTrigger value="features">
            {t("sections.features.title")}
          </TabsTrigger>
          <TabsTrigger value="cta">{t("sections.cta.title")}</TabsTrigger>
        </TabsList>

        {tabs.map((tab) => (
          <ContentSection
            key={tab.value}
            handleSubmit={handleSubmit(tab.value)}
            {...tab}
          />
        ))}
      </Tabs>
    </>
  );
};

export default ContentManagement;
