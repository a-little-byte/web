"use client";

import { useHeroCarousels } from "@/app/[locale]/(private)/admin/carousel/_hooks/useHeroCarousels";
import { Form } from "@/components/base/Form";
import { InputField } from "@/components/base/InputField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HeroCarouselSelect } from "@/db/models/HeroCarousel";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { apiClient } from "@/lib/apiClient";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { UUID } from "node:crypto";
import { useEffect, useState } from "react";
import { z } from "zod";

const carouselSchemaForm = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image_url: z.string().min(1),
  button_text: z.string().min(1),
  button_link: z.string().min(1),
  order: z.number().min(0),
  active: z.boolean(),
});

type FormData = z.infer<typeof carouselSchemaForm>;

const CarouselManagement = () => {
  const { data: items, refetch: refetchItems } = useHeroCarousels();

  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<HeroCarouselSelect | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("admin.carousel");
  const form = useForm(carouselSchemaForm, {
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      button_text: "",
      button_link: "",
      order: 0,
      active: false,
    },
  });

  const onSubmit = async (json: FormData) => {
    setIsLoading(true);

    try {
      if (currentItem) {
        await apiClient.hero[":id"].$patch({
          json,
          param: { id: currentItem.id },
        });
      } else {
        await apiClient.hero.$post({ json });
      }

      toast({
        title: t("toasts.saveSuccess.title"),
        description: t("toasts.saveSuccess.description", {
          action: currentItem ? "updated" : "created",
        }),
      });

      setIsOpen(false);
      setCurrentItem(null);
      await refetchItems();
    } catch (error) {
      toast({
        title: t("toasts.saveError.title"),
        description: t("toasts.saveError.description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMove = (id: string, direction: "up" | "down") => async () => {
    const currentIndex = items?.findIndex((item) => item.id === id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= items?.length) return;

    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(currentIndex, 1);
    updatedItems.splice(newIndex, 0, movedItem);

    try {
      await Promise.all(
        updatedItems.map(async (item, index) => {
          await apiClient.hero[":id"].$patch({
            json: { order: index },
            param: { id: item.id },
          });
        }),
      );

      await refetchItems();
    } catch (error) {
      toast({
        title: t("toasts.reorderError.title"),
        description: t("toasts.reorderError.description"),
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = (id: string) => async (active: boolean) => {
    try {
      await apiClient.hero[":id"].$patch({
        json: { active },
        param: { id },
      });

      await refetchItems();
    } catch (error) {
      toast({
        title: t("toasts.updateError.title"),
        description: t("toasts.updateError.description"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: UUID) => async () => {
    try {
      await apiClient.hero[":id"].$delete({ param: { id } });

      toast({
        title: t("toasts.deleteSuccess.title"),
        description: t("toasts.deleteSuccess.description"),
      });

      await refetchItems();
    } catch (error) {
      toast({
        title: t("toasts.deleteError.title"),
        description: t("toasts.deleteError.description"),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (currentItem) {
      form.reset(currentItem);
    } else {
      form.reset({
        title: "",
        description: "",
        image_url: "",
        button_text: "",
        button_link: "",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(currentItem)]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentItem(null)}>
              {t("addSlide")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentItem ? t("editSlide") : t("addSlide")}
              </DialogTitle>
            </DialogHeader>
            <Form form={form} onSubmit={onSubmit}>
              {(
                [
                  "title",
                  "description",
                  "image_url",
                  "button_text",
                  "button_link",
                ] as const
              ).map((field) => (
                <InputField
                  key={field}
                  control={form.control}
                  name={field}
                  label={t(`form.${field}.label`)}
                  placeholder={t(`form.${field}.placeholder`)}
                />
              ))}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {t("form.submit.update")}
              </Button>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {["title", "image", "active", "actions"].map((header) => (
              <TableHead key={header}>{t(`table.${header}`)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                <Skeleton className="w-full h-10" />
              </TableCell>
            </TableRow>
          ) : (
            items?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    className="w-20 h-12 object-cover rounded"
                    width={80}
                    height={48}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={item.active}
                    onCheckedChange={handleToggleActive(item.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleMove(item.id, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleMove(item.id, "down")}
                      disabled={index === items.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentItem(item);
                        setIsOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={handleDelete(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CarouselManagement;
