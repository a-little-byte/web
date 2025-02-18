"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define schemas for each section
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

export default function ContentManagement() {
  const [content, setContent] = useState<any[]>([]);
  const { toast } = useToast();
  const t = useTranslations("admin.content");

  const heroForm = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
  });

  const featuresForm = useForm<BasicFormData>({
    resolver: zodResolver(basicSchema),
  });

  const ctaForm = useForm<BasicFormData>({
    resolver: zodResolver(basicSchema),
  });

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

      // Set form default values
      const heroContent = data.find((c) => c.section === "hero")?.content || {};
      const featuresContent =
        data.find((c) => c.section === "features")?.content || {};
      const ctaContent = data.find((c) => c.section === "cta")?.content || {};

      heroForm.reset(heroContent);
      featuresForm.reset(featuresContent);
      ctaForm.reset(ctaContent);
    } catch (error) {
      toast({
        title: t("toasts.error.title"),
        description: t("toasts.error.fetchError"),
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (
    section: string,
    data: HeroFormData | BasicFormData
  ) => {
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
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">{t("sections.hero.title")}</TabsTrigger>
          <TabsTrigger value="features">
            {t("sections.features.title")}
          </TabsTrigger>
          <TabsTrigger value="cta">{t("sections.cta.title")}</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>{t("sections.hero.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={heroForm.handleSubmit((data) =>
                  handleSubmit("hero", data)
                )}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("sections.hero.form.title")}
                  </label>
                  <Input {...heroForm.register("title")} />
                  {heroForm.formState.errors.title && (
                    <p className="text-sm text-red-500">
                      {heroForm.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("sections.hero.form.description")}
                  </label>
                  <Textarea {...heroForm.register("description")} />
                  {heroForm.formState.errors.description && (
                    <p className="text-sm text-red-500">
                      {heroForm.formState.errors.description.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("sections.hero.form.buttonText")}
                  </label>
                  <Input {...heroForm.register("buttonText")} />
                  {heroForm.formState.errors.buttonText && (
                    <p className="text-sm text-red-500">
                      {heroForm.formState.errors.buttonText.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("sections.hero.form.buttonLink")}
                  </label>
                  <Input {...heroForm.register("buttonLink")} />
                  {heroForm.formState.errors.buttonLink && (
                    <p className="text-sm text-red-500">
                      {heroForm.formState.errors.buttonLink.message}
                    </p>
                  )}
                </div>
                <Button type="submit">{t("buttons.save")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>{t("sections.features.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={featuresForm.handleSubmit((data) =>
                  handleSubmit("features", data)
                )}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("sections.features.form.title")}
                  </label>
                  <Input {...featuresForm.register("title")} />
                  {featuresForm.formState.errors.title && (
                    <p className="text-sm text-red-500">
                      {featuresForm.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("sections.features.form.description")}
                  </label>
                  <Textarea {...featuresForm.register("description")} />
                  {featuresForm.formState.errors.description && (
                    <p className="text-sm text-red-500">
                      {featuresForm.formState.errors.description.message}
                    </p>
                  )}
                </div>
                <Button type="submit">{t("buttons.save")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <CardTitle>{t("sections.cta.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={ctaForm.handleSubmit((data) =>
                  handleSubmit("cta", data)
                )}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("sections.cta.form.title")}
                  </label>
                  <Input {...ctaForm.register("title")} />
                  {ctaForm.formState.errors.title && (
                    <p className="text-sm text-red-500">
                      {ctaForm.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("sections.cta.form.description")}
                  </label>
                  <Textarea {...ctaForm.register("description")} />
                  {ctaForm.formState.errors.description && (
                    <p className="text-sm text-red-500">
                      {ctaForm.formState.errors.description.message}
                    </p>
                  )}
                </div>
                <Button type="submit">{t("buttons.save")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
