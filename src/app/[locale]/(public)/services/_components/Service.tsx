"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ServiceSelect } from "@/db/models/Service";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiClient";
import { Check, Lock, Shield, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

export const durationOptions = [
  { value: "1", multiplier: 1, discount: 0 },
  { value: "3", multiplier: 3, discount: 0.1 },
  { value: "12", multiplier: 12, discount: 0.2 },
];

const calculatePrice = (basePrice: number, duration: string) => {
  const option = durationOptions.find((opt) => opt.value === duration);
  if (!option) return basePrice;

  const totalBeforeDiscount = basePrice * option.multiplier;
  const discount = totalBeforeDiscount * option.discount;
  return totalBeforeDiscount - discount;
};

const icons = {
  MDR: <Shield className="h-8 w-8 text-primary" />,
  EDR: <Zap className="h-8 w-8 text-primary" />,
  XDR: <Lock className="h-8 w-8 text-primary" />,
} as const;

export const Service = ({ service }: { service: ServiceSelect }) => {
  const t = useTranslations("services");
  const [duration, setDuration] = useState(durationOptions[0].value);
  const { toast } = useToast();

  const addToCart = useCallback(async () => {
    try {
      await apiClient.account.cart.$post({
        json: {
          serviceId: service.id,
          quantity: 1,
          duration,
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      key={service.id}
      className="flex flex-col justify-between rounded-3xl bg-card p-8 ring-1 ring-muted shadow-sm"
    >
      <div>
        <div className="flex items-center gap-x-4">
          {icons[service.name as keyof typeof icons]}
          <h3 className="text-lg font-semibold leading-8">{service.name}</h3>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {service.description}
        </p>
        <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
          {service.features.map((feature: string) => (
            <li key={feature} className="flex gap-x-3">
              <Check className="h-5 w-5 text-primary" />
              {t(`products.${service.name}.features.${feature}`)}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <div className="text-2xl font-bold mb-3">
          $
          {Number(calculatePrice(service.price, duration).toFixed(2)) /
            Number(
              durationOptions.find((opt) => opt.value === duration)?.multiplier,
            )}{" "}
          <span className="text-sm text-muted-foreground/90">
            / {service.period}
          </span>
        </div>

        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger>
            <SelectValue placeholder={t("duration.select")} />
          </SelectTrigger>
          <SelectContent>
            {durationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {`${t(`duration.options.${option.value}`)} ${
                  option.discount > 0
                    ? `(${t("duration.discount", {
                        discount: option.discount * 100,
                      })})`
                    : ""
                }`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="mt-6 w-full" onClick={addToCart}>
          {t("cart.addToCart")}
        </Button>
      </div>
    </div>
  );
};
