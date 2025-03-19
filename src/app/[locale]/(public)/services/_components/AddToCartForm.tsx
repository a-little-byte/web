"use client";

import {
  durationOptions,
  servicesFormSchema,
} from "@/app/[locale]/(public)/services/_components/Services";
import { Form } from "@/components/base/Form";
import { SelectField } from "@/components/base/SelectField";
import { Button } from "@/components/ui/button";
import { ServiceSelect } from "@/db/utils";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const AddToCartForm = ({
  service,
  form,
}: {
  service: ServiceSelect;
  form: UseFormReturn<
    z.input<typeof servicesFormSchema>,
    unknown,
    z.output<typeof servicesFormSchema>
  >;
}) => {
  const t = useTranslations("services");
  const { toast } = useToast();

  const addToCart = async (values: z.infer<typeof servicesFormSchema>) => {
    try {
      const result = await apiClient.cart.$post({
        json: {
          serviceId: service.id,
          quantity: 1,
        },
      });

      toast({
        title: t("cart.success.title"),
        description: t("cart.success.description", {
          product: service.name,
        }),
      });
    } catch (error) {
      toast({
        title: t("cart.error.addFailed.title"),
        description: t("cart.error.addFailed.description"),
        variant: "destructive",
      });
    }
  };

  return (
    <Form form={form} onSubmit={(values) => addToCart(values)}>
      <SelectField
        control={form.control}
        name={`durations.${service.id}`}
        label={t("duration.select")}
        placeholder={t("duration.select")}
        options={durationOptions.map((option) => ({
          label: `${t(`duration.options.${option.value}`)} ${
            option.discount > 0
              ? `(${t("duration.discount", {
                  discount: option.discount * 100,
                })})`
              : ""
          }`,
          value: option.value,
        }))}
      />

      <Button className="mt-6 w-full" type="submit">
        {t("cart.addToCart")}
      </Button>
    </Form>
  );
};
