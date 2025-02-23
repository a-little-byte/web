"use client";

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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { createClient } from "@/lib/supabase/client";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
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

const CarouselManagement = () => {
  const supabase = createClient();
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<CarouselItem | null>(null);
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
    },
  });

  useEffect(() => {
    fetchItems();
  }, []);

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
  }, [JSON.stringify(currentItem)]);

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

  const handleMove = (id: string, direction: "up" | "down") => async () => {
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

  const handleToggleActive = (id: string) => async (active: boolean) => {
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

  const handleDelete = (id: string) => async () => {
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
          {items.map((item, index) => (
            <TableRow key={item.id}>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CarouselManagement;
