"use client";

import { Form } from "@/components/base/Form";
import { InputField } from "@/components/base/InputField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { useQuery } from "@/hooks/useQuery";
import { apiClient } from "@/lib/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HomeIcon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

const billingAddressSchema = z.object({
  street: z.string().min(1, { message: "Street is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postal_code: z.string().min(1, { message: "Postal code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
});

type BillingAddressFormValues = z.infer<typeof billingAddressSchema>;

type BillingAddress = {
  id: string;
  user_id: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  createdAt: string;
  updatedAt: string;
};

const BillingAddressesPage = () => {
  const t = useTranslations("dashboard.billingAddresses");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<BillingAddress | null>(
    null,
  );

  const form = useForm(billingAddressSchema, {
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
  });

  const { data, isLoading, refetch } = useQuery(
    apiClient.account["billing-addresses"],
  );

  const billingAddresses: BillingAddress[] = (() => {
    if (!data) return [];
    if (Array.isArray(data)) return data as BillingAddress[];
    if (data && typeof data === "object" && "id" in data)
      return [data as BillingAddress];
    return [];
  })();

  const createBillingAddressMutation = useMutation({
    mutationFn: async (data: BillingAddressFormValues) => {
      const response = await apiClient.account["billing-addresses"].$post({
        json: data,
      });
      return response.json();
    },
    onSuccess: async () => {
      await refetch();
      toast({
        title: t("toasts.add.title"),
        description: t("toasts.add.description"),
      });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: t("toasts.addError.title"),
        description: t("toasts.addError.description"),
        variant: "destructive",
      });
    },
  });

  const updateBillingAddressMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: BillingAddressFormValues;
    }) => {
      const response = await apiClient.account["billing-addresses"][
        ":billingAddressId"
      ].$patch({
        param: { billingAddressId: id },
        json: data,
      });
      return response.json();
    },
    onSuccess: async () => {
      await refetch();
      toast({
        title: t("toasts.edit.title"),
        description: t("toasts.edit.description"),
      });
      setEditingAddress(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: t("toasts.editError.title"),
        description: t("toasts.editError.description"),
        variant: "destructive",
      });
    },
  });

  const deleteBillingAddressMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.account["billing-addresses"][
        ":billingAddressId"
      ].$delete({
        param: { billingAddressId: id },
      });
      return response.json();
    },
    onSuccess: async () => {
      await refetch();
      toast({
        title: t("toasts.delete.title"),
        description: t("toasts.delete.description"),
      });
    },
    onError: () => {
      toast({
        title: t("toasts.deleteError.title"),
        description: t("toasts.deleteError.description"),
        variant: "destructive",
      });
    },
  });

  const handleEditAddress = (address: BillingAddress) => {
    setEditingAddress(address);
    form.reset({
      street: address.street,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
    });
  };

  const onSubmit = (values: BillingAddressFormValues) => {
    if (editingAddress) {
      updateBillingAddressMutation.mutate({
        id: editingAddress.id,
        data: values,
      });
    } else {
      createBillingAddressMutation.mutate(values);
    }
  };

  const handleDialogClose = () => {
    if (editingAddress) {
      setEditingAddress(null);
    } else {
      setIsCreateDialogOpen(false);
    }
    form.reset();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold lowercase first-letter:uppercase">
          {t("title")}
        </h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          {t("actions.add")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <p>{t("loading")}</p>
        </div>
      ) : billingAddresses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {billingAddresses.map((address) => (
            <Card
              key={address.id}
              className="hover:shadow-md transition-shadow duration-300 border-2"
            >
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-primary" />
                  {address.country}
                </CardTitle>
                <CardDescription className="font-medium">
                  {address.city}, {address.state}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm">
                  <p className="flex items-center">
                    <HomeIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    {address.street}
                  </p>
                  <p className="flex items-center">
                    <MailIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    {address.postal_code}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditAddress(address)}
                  className="hover:bg-primary/10"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  {t("actions.edit")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    deleteBillingAddressMutation.mutate(address.id)
                  }
                  className="hover:bg-destructive/90"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  {t("actions.delete")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t("empty.title")}</CardTitle>
            <CardDescription>{t("empty.description")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              {t("actions.add")}
            </Button>
          </CardFooter>
        </Card>
      )}

      <Dialog
        open={isCreateDialogOpen || editingAddress !== null}
        onOpenChange={handleDialogClose}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? t("dialog.edit.title") : t("dialog.add.title")}
            </DialogTitle>
            <DialogDescription>
              {editingAddress
                ? t("dialog.edit.description")
                : t("dialog.add.description")}
            </DialogDescription>
          </DialogHeader>

          <Form form={form} onSubmit={onSubmit} className="space-y-4">
            <InputField
              control={form.control}
              name="street"
              label={t("form.street")}
              placeholder={t("form.streetPlaceholder")}
            />
            <InputField
              control={form.control}
              name="city"
              label={t("form.city")}
              placeholder={t("form.cityPlaceholder")}
            />
            <InputField
              control={form.control}
              name="state"
              label={t("form.state")}
              placeholder={t("form.statePlaceholder")}
            />
            <InputField
              control={form.control}
              name="postal_code"
              label={t("form.postalCode")}
              placeholder={t("form.postalCodePlaceholder")}
            />
            <InputField
              control={form.control}
              name="country"
              label={t("form.country")}
              placeholder={t("form.countryPlaceholder")}
            />

            <DialogFooter className="mt-6">
              <Button type="submit">
                {editingAddress ? t("actions.save") : t("actions.create")}
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingAddressesPage;
