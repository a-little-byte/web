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
import { supabase, type Tables } from "@/lib/supabase";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function ServicesManagement() {
  const t = useTranslations("admin.services");
  const [services, setServices] = useState<Tables<"services">[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentService, setCurrentService] =
    useState<Tables<"services"> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setServices(data);

      setServices(services);
    } catch (error) {
      toast({
        title: t("toasts.fetchError.title"),
        description: t("toasts.fetchError.description"),
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const serviceData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      period: formData.get("period") as string,
    };

    try {
      if (currentService) {
        await supabase
          .from("services")
          .update(serviceData)
          .eq("id", currentService.id);
      } else {
        await supabase.from("services").insert(serviceData).select();
      }

      toast({
        title: t("toasts.saveSuccess.title"),
        description: t("toasts.saveSuccess.description", {
          action: currentService ? "updated" : "created",
        }),
      });

      setIsOpen(false);
      setCurrentService(null);
      fetchServices();
    } catch (error) {
      toast({
        title: t("toasts.saveError.title"),
        description: t("toasts.saveError.description"),
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: Tables<"services">) => {
    setCurrentService(service);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("services").delete().eq("id", id);

      toast({
        title: t("toasts.deleteSuccess.title"),
        description: t("toasts.deleteSuccess.description"),
      });

      fetchServices();
    } catch (error) {
      toast({
        title: t("toasts.deleteError.title"),
        description: t("toasts.deleteError.description"),
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
            <Button onClick={() => setCurrentService(null)}>
              {t("addService")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentService ? t("editService") : t("addService")}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  {t("form.name.label")}
                </label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={currentService?.name}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                >
                  {t("form.description.label")}
                </label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={currentService?.description}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium mb-1"
                >
                  {t("form.price.label")}
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={currentService?.price}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="period"
                  className="block text-sm font-medium mb-1"
                >
                  {t("form.period.label")}
                </label>
                <Input
                  id="period"
                  name="period"
                  defaultValue={currentService?.period}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {currentService
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
            <TableHead>{t("table.name")}</TableHead>
            <TableHead>{t("table.description")}</TableHead>
            <TableHead>{t("table.price")}</TableHead>
            <TableHead>{t("table.period")}</TableHead>
            <TableHead>{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>${service.price}</TableCell>
              <TableCell>{service.period}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    {t("actions.edit")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                  >
                    {t("actions.delete")}
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
