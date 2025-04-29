"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  PlusCircle,
  CreditCard,
  Trash2,
  CheckCircle,
  Edit,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { apiClient } from "@/lib/apiClient";
import { toast } from "@/hooks/use-toast";
import {
  AddPaymentMethodDialog,
  AddPaymentMethodFormData,
} from "./_components/addForm";
import {
  EditPaymentMethodDialog,
  EditPaymentMethodFormData,
} from "./_components/editForm";
import { encrypt } from "@/api/c/AES";
import { PaymentMethod } from "@/db/models/Payment";

const PaymentMethods = () => {
  const t = useTranslations("dashboard.payment-methods");
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod | null>(
    null,
  );

  const {
    data: paymentMethods,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: async () => {
      try {
        const response = await apiClient.payments["payment-methodes"].$get();

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();
        return data.paymentMethods || [];
      } catch (error) {
        toast({
          title: t("toasts.fetchError.title"),
          description: t("toasts.fetchError.description"),
          variant: "destructive",
        });
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: AddPaymentMethodFormData) => {
      const { ciphertext, iv } = await encrypt(
        data.card_number,
        process.env.NEXT_PUBLIC_SECRET_KEY!,
        [data.cvv, data.expiry_month, data.expiry_year, data.type],
      );

      return apiClient.payments["payment-methodes"].$post({
        json: {
          type: data.type,
          payment_token: ciphertext,
          iv,
          last_four: data.card_number.slice(-4),
          expiry_month: parseInt(data.expiry_month),
          expiry_year: parseInt(data.expiry_year),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast({
        title: t("toasts.add.title"),
        description: t("toasts.add.description"),
      });
      setIsAddDialogOpen(false);
    },
    onError: () => {
      toast({
        title: t("toasts.addError.title"),
        description: t("toasts.addError.description"),
        variant: "destructive",
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: EditPaymentMethodFormData;
    }) =>
      apiClient.payments["payment-methodes"][":id"].$patch({
        param: { id },
        json: {
          expiry_month: parseInt(data.expiry_month),
          expiry_year: parseInt(data.expiry_year),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast({
        title: t("toasts.edit.title"),
        description: t("toasts.edit.description"),
      });
      setIsEditDialogOpen(false);
      setCurrentMethod(null);
    },
    onError: () => {
      toast({
        title: t("toasts.editError.title"),
        description: t("toasts.editError.description"),
        variant: "destructive",
      });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.payments["payment-methodes"][":id"].$patch({
        param: { id },
        json: { is_default: true },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast({
        title: t("toasts.setDefault.title"),
        description: t("toasts.setDefault.description"),
      });
    },
    onError: () => {
      toast({
        title: t("toasts.setDefaultError.title"),
        description: t("toasts.setDefaultError.description"),
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.payments["payment-methodes"][":id"].$delete({ param: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
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

  const handleAddPaymentMethod = (data: AddPaymentMethodFormData) => {
    addMutation.mutate(data);
  };

  const handleEditPaymentMethod = (data: EditPaymentMethodFormData) => {
    if (currentMethod) {
      const id = currentMethod.id as unknown as string;
      editMutation.mutate({ id, data });
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEditClick = (method: PaymentMethod) => {
    setCurrentMethod(method);
    setIsEditDialogOpen(true);
  };

  const formatExpiry = (month: number, year: number) => {
    return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
  };

  if (isLoading || error) {
    return (
      <Card className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">{t("loading")}</p>
      </Card>
    );
  }

  if (!paymentMethods) {
    return (
      <Card className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">{t("noMethods")}</p>
      </Card>
    );
  }

  return (
    <div>
      <div className="container">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-center">
            {t("subtitle")}
          </p>

          <div className="mt-10 grid gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="capitalize">
                      {method.type} •••• {method.last_four}
                      {method.is_default && (
                        <span className="ml-2 inline-flex items-center text-sm text-green-600">
                          <CheckCircle className="mr-1 h-4 w-4" />{" "}
                          {t("default")}
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {t("expires")}{" "}
                      {formatExpiry(method.expiry_month, method.expiry_year)}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    {!method.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                        disabled={setDefaultMutation.isPending}
                      >
                        {t("setDefault")}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleEditClick(method as unknown as PaymentMethod)
                      }
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      {t("edit")}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(method.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    {t("remove")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <PlusCircle className="h-5 w-5" />
                  {t("addNew")}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">
              {t("paymentInfo.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("paymentInfo.description")}
            </p>
            <ul className="mt-6 space-y-2 text-muted-foreground">
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                {t("paymentInfo.security.pci")}
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                {t("paymentInfo.security.encryption")}
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                {t("paymentInfo.security.verification")}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <AddPaymentMethodDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddPaymentMethod}
        isPending={addMutation.isPending}
      />

      <EditPaymentMethodDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditPaymentMethod}
        isPending={editMutation.isPending}
        paymentMethod={currentMethod}
      />
    </div>
  );
};

export default PaymentMethods;
