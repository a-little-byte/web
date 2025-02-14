"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageContent } from "@/db/schema";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/src/lib/db";
import { useEffect, useState } from "react";

export default function ContentManagement() {
  const [content, setContent] = useState<PageContent[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const content = await db
        .selectFrom("page_content")
        .selectAll()
        .orderBy("section")
        .execute();

      setContent(content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (section: string, formData: FormData) => {
    const contentData = {
      section,
      content: {
        title: formData.get("title"),
        description: formData.get("description"),
        ...(section === "hero" && {
          buttonText: formData.get("buttonText"),
          buttonLink: formData.get("buttonLink"),
        }),
      },
    };

    const existing = content.find((c) => c.section === section);

    try {
      if (existing) {
        await db
          .updateTable("page_content")
          .set(contentData)
          .where("id", "=", existing.id)
          .execute();
      } else {
        await db.insertInto("page_content").values(contentData).execute();
      }

      toast({
        title: "Success",
        description: "Content updated successfully",
      });

      fetchContent();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      });
    }
  };

  const getContentBySection = (section: string) => {
    return (content.find((c) => c.section === section)?.content as any) || {};
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Content Management</h1>

      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="features">Features Section</TabsTrigger>
          <TabsTrigger value="cta">CTA Section</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit("hero", new FormData(e.currentTarget));
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <Input
                    name="title"
                    defaultValue={getContentBySection("hero").title}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Textarea
                    name="description"
                    defaultValue={getContentBySection("hero").description}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Button Text
                  </label>
                  <Input
                    name="buttonText"
                    defaultValue={getContentBySection("hero").buttonText}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Button Link
                  </label>
                  <Input
                    name="buttonLink"
                    defaultValue={getContentBySection("hero").buttonLink}
                    required
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Features Section</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit("features", new FormData(e.currentTarget));
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <Input
                    name="title"
                    defaultValue={getContentBySection("features").title}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Textarea
                    name="description"
                    defaultValue={getContentBySection("features").description}
                    required
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <CardTitle>CTA Section</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit("cta", new FormData(e.currentTarget));
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <Input
                    name="title"
                    defaultValue={getContentBySection("cta").title}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Textarea
                    name="description"
                    defaultValue={getContentBySection("cta").description}
                    required
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
