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
import { ArrowDown, ArrowUp, Trash } from "lucide-react";
import { useEffect, useState } from "react";

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

export default function CarouselManagement() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<CarouselItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

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
        title: "Error",
        description: "Failed to fetch carousel items",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const itemData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image_url: formData.get("image_url") as string,
      button_text: formData.get("button_text") as string,
      button_link: formData.get("button_link") as string,
      order: currentItem ? currentItem.order : items.length,
      active: true,
    };

    try {
      if (currentItem) {
        const { error } = await supabase
          .from("hero_carousel")
          .update(itemData)
          .eq("id", currentItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("hero_carousel")
          .insert([itemData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Carousel item ${
          currentItem ? "updated" : "created"
        } successfully`,
      });

      setIsOpen(false);
      setCurrentItem(null);
      fetchItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save carousel item",
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
        <h1 className="text-3xl font-bold">Hero Carousel Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentItem(null)}>Add Slide</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentItem ? "Edit Slide" : "Add New Slide"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={currentItem?.title}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={currentItem?.description}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  defaultValue={currentItem?.image_url}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="button_text">Button Text</Label>
                <Input
                  id="button_text"
                  name="button_text"
                  defaultValue={currentItem?.button_text}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="button_link">Button Link</Label>
                <Input
                  id="button_link"
                  name="button_link"
                  defaultValue={currentItem?.button_link}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {currentItem ? "Update" : "Create"} Slide
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
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
