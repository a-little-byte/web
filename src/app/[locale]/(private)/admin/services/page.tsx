"use client";

import { Form } from "@/components/base/Form";
import { InputField } from "@/components/base/InputField";
import { TextareaField } from "@/components/base/TextareaField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceSelect } from "@/db/models/Service";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { apiClient } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().min(0),
  period: z.string().min(1),
});

const ServicesManagement = () => {
  const t = useTranslations("admin.services");
  const {
    data: services,
    isLoading,
    refetch: refetchServices,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      try {
        const res = await apiClient.services.$get();
        const data = await res.json();

        return data.map((service) => ({
          ...service,
          createdAt: new Date(service.createdAt),
          updatedAt: new Date(service.updatedAt),
        }));
      } catch (error) {
        toast({
          title: t("toasts.fetchError.title"),
          description: t("toasts.fetchError.description"),
          variant: "destructive",
        });
      }
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceSelect | null>(
    null,
  );
  const { toast } = useToast();
  const form = useForm(serviceSchema, {
    defaultValues: currentService || {
      name: "",
      description: "",
      price: 0,
      period: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof serviceSchema>) => {
    try {
      if (currentService) {
        await apiClient.services[":id"].$patch({
          param: { id: currentService.id },
          json: values,
        });
      } else {
        await apiClient.services.$post({ json: values });
      }

      toast({
        title: t("toasts.saveSuccess.title"),
        description: t("toasts.saveSuccess.description", {
          action: currentService ? "updated" : "created",
        }),
      });

      setIsOpen(false);
      setCurrentService(null);
    } catch (error) {
      toast({
        title: t("toasts.saveError.title"),
        description: t("toasts.saveError.description"),
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: ServiceSelect) => () => {
    setCurrentService(service);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => async () => {
    try {
      await apiClient.services[":id"].$delete({
        param: { id },
      });

      toast({
        title: t("toasts.deleteSuccess.title"),
        description: t("toasts.deleteSuccess.description"),
      });

      await refetchServices();
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
            <Form form={form} onSubmit={handleSubmit}>
              <InputField
                control={form.control}
                name="name"
                label={t("form.name.label")}
              />
              <TextareaField
                control={form.control}
                name="description"
                label={t("form.description.label")}
              />
              <InputField
                control={form.control}
                name="price"
                label={t("form.price.label")}
              />
              <InputField
                control={form.control}
                name="period"
                label={t("form.period.label")}
              />
              <Button type="submit">
                {currentService
                  ? t("form.submit.update")
                  : t("form.submit.create")}
              </Button>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {["name", "description", "price", "period", "actions"].map(
              (column) => (
                <TableHead key={column}>{t(`table.${column}`)}</TableHead>
              ),
            )}
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
            services?.map((service) => (
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
                      onClick={handleEdit(service)}
                    >
                      {t("actions.edit")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete(service.id)}
                    >
                      {t("actions.delete")}
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

export default ServicesManagement;
