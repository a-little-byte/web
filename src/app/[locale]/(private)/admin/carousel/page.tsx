"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_text: string;
  button_link: string;
  order: number;
  active: boolean;
}

const carouselSchemaForm = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image_url: z.string().min(1),
  button_text: z.string().min(1),
  button_link: z.string().min(1),
});

type FormData = z.infer<typeof carouselSchemaForm>;

export default function CarouselManagement() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<CarouselItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("admin.carousel");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(carouselSchemaForm),
    defaultValues: currentItem || {
      title: "",
      description: "",
      image_url: "",
      button_text: "",
      button_link: "",
    },
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (currentItem) {
      reset(currentItem);
    } else {
      reset({
        title: "",
        description: "",
        image_url: "",
        button_text: "",
        button_link: "",
      });
    }
  }, [currentItem, reset]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_carousel")
        .select("*")
        .order("order");

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast({
        title: t("toasts.fetchError.title"),
        description: t("toasts.fetchError.description"),
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      if (currentItem) {
        const { error } = await supabase
          .from("hero_carousel")
          .update(data)
          .eq("id", currentItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("hero_carousel").insert([data]);

        if (error) throw error;
      }

      toast({
        title: t("toasts.saveSuccess.title"),
        description: t("toasts.saveSuccess.description", {
          action: currentItem ? "updated" : "created",
        }),
      });

      setIsOpen(false);
      setCurrentItem(null);
      fetchItems();
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

  const handleMove = async (id: string, direction: "up" | "down") => {
    const currentIndex = items.findIndex((item) => item.id === id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= items.length) return;

    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(currentIndex, 1);
    updatedItems.splice(newIndex, 0, movedItem);

    try {
      const updates = updatedItems.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      const { error } = await supabase.from("hero_carousel").upsert(updates);

      if (error) throw error;

      fetchItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder items",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from("hero_carousel")
        .update({ active })
        .eq("id", id);

      if (error) throw error;

      fetchItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("hero_carousel")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Carousel item deleted successfully",
      });

      fetchItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete carousel item",
        variant: "destructive",
      });
    }
  };

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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("form.title.label")}</Label>
                <Input
                  id="title"
                  placeholder={t("form.title.placeholder")}
                  {...register("title")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">
                  {t("form.description.label")}
                </Label>
                <Textarea
                  id="description"
                  placeholder={t("form.description.placeholder")}
                  {...register("description")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">{t("form.imageUrl.label")}</Label>
                <Input
                  id="image_url"
                  placeholder={t("form.imageUrl.placeholder")}
                  {...register("image_url")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="button_text">
                  {t("form.buttonText.label")}
                </Label>
                <Input
                  id="button_text"
                  placeholder={t("form.buttonText.placeholder")}
                  {...register("button_text")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="button_link">
                  {t("form.buttonLink.label")}
                </Label>
                <Input
                  id="button_link"
                  placeholder={t("form.buttonLink.placeholder")}
                  {...register("button_link")}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {currentItem
                  ? t("form.submit.update")
                  : t("form.submit.create")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.order")}</TableHead>
            <TableHead>{t("table.title")}</TableHead>
            <TableHead>{t("table.image")}</TableHead>
            <TableHead>{t("table.active")}</TableHead>
            <TableHead>{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-20 h-12 object-cover rounded"
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={item.active}
                  onCheckedChange={(checked) =>
                    handleToggleActive(item.id, checked)
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleMove(item.id, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleMove(item.id, "down")}
                    disabled={index === items.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
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
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
