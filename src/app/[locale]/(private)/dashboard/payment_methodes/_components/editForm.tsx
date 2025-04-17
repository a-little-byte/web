import { useEffect } from "react";
import * as z from "zod";
import { useForm } from "@/hooks/useForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentMethod } from "../page";


const editPaymentMethodSchema = z.object({
  expiry_month: z.string().refine((val) => {
    const month = parseInt(val);
    return month >= 1 && month <= 12;
  }, "Must be a valid month (1-12)"),
  expiry_year: z.string().refine((val) => {
    const year = parseInt(val);
    const currentYear = new Date().getFullYear();
    return year >= currentYear && year <= currentYear + 20;
  }, "Must be a valid year"),
});

export type EditPaymentMethodFormData = z.infer<typeof editPaymentMethodSchema>;

type EditPaymentMethodDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EditPaymentMethodFormData) => void;
  isPending: boolean;
  paymentMethod: PaymentMethod | null;
}

export function EditPaymentMethodDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  paymentMethod
}: EditPaymentMethodDialogProps) {
  const t = useTranslations("dashboard.payment-methods");
  
  const form = useForm(editPaymentMethodSchema,
    {
      defaultValues: {
        expiry_month: "",
        expiry_year: "",
      },
    }
  );

  useEffect(() => {
    if (paymentMethod) {
      form.setValue("expiry_month", paymentMethod.expiry_month.toString());
      form.setValue("expiry_year", paymentMethod.expiry_year.toString());
    }
  }, [paymentMethod, form]);

  const handleSubmit = (data: EditPaymentMethodFormData) => {
    onSubmit(data);
  };

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  // Generate month options for select fields
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return (
      <SelectItem key={month} value={month.toString()}>
        {month.toString().padStart(2, '0')}
      </SelectItem>
    );
  });

  // Generate year options for select fields
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    return (
      <SelectItem key={year} value={year.toString()}>
        {year}
      </SelectItem>
    );
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialogs.edit.title")}</DialogTitle>
          <DialogDescription>
            {paymentMethod && (
              <>
                {t("dialogs.edit.description")} {paymentMethod.type.toUpperCase()} •••• {paymentMethod.last_four}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiry_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dialogs.edit.expiryMonth")}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {monthOptions}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiry_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dialogs.edit.expiryYear")}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {yearOptions}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleOpenChange(false)}
              >
                {t("dialogs.cancel")}
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
              >
                {isPending ? t("dialogs.updating") : t("dialogs.edit.submit")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
