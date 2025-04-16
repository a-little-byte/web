import * as z from "zod";
import { useForm } from "@/hooks/useForm";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const addPaymentMethodSchema = z.object({
  type: z.string().min(1, "Card type is required"),
  card_number: z.string().min(15, "Card number must be at least 15 digits").max(19, "Card number must not exceed 19 digits"),
  expiry_month: z.string().refine((val) => {
    const month = parseInt(val);
    return month >= 1 && month <= 12;
  }, "Must be a valid month (1-12)"),
  expiry_year: z.string().refine((val) => {
    const year = parseInt(val);
    const currentYear = new Date().getFullYear();
    return year >= currentYear && year <= currentYear + 20;
  }, "Must be a valid year"),
  cvv: z.string().min(3, "CVV must be at least 3 digits").max(4, "CVV must not exceed 4 digits"),
});

export type AddPaymentMethodFormData = z.infer<typeof addPaymentMethodSchema>;

type AddPaymentMethodDialogProps  = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddPaymentMethodFormData) => void;
  isPending: boolean;
}

export const AddPaymentMethodDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isPending 
}: AddPaymentMethodDialogProps) => {
  const t = useTranslations("dashboard.payment-methods");
  const form = useForm(addPaymentMethodSchema,{
    defaultValues: {
      type: "visa",
      card_number: "",
      expiry_month: "",
      expiry_year: "",
      cvv: "",
    }
  });

  const handleSubmit = (data: AddPaymentMethodFormData) => {
    onSubmit(data);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return (
      <SelectItem key={month} value={month.toString()}>
        {month.toString().padStart(2, '0')}
      </SelectItem>
    );
  });

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
          <DialogTitle>{t("dialogs.add.title")}</DialogTitle>
          <DialogDescription>
            {t("dialogs.add.description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dialogs.add.cardType")}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("dialogs.add.selectCardType")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="visa">Visa</SelectItem>
                      <SelectItem value="mastercard">Mastercard</SelectItem>
                      <SelectItem value="amex">American Express</SelectItem>
                      <SelectItem value="discover">Discover</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="card_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dialogs.add.cardNumber")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="XXXX XXXX XXXX XXXX" 
                      {...field} 
                      maxLength={19}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="expiry_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dialogs.add.expiryMonth")}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
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
                    <FormLabel>{t("dialogs.add.expiryYear")}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
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
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dialogs.add.cvv")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="CVV" 
                        {...field} 
                        maxLength={4}
                      />
                    </FormControl>
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
                {isPending ? t("dialogs.adding") : t("dialogs.add.submit")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
