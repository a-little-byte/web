"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Lock, Shield, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  durations: {
    [key: string]: string;
  };
};

const solutions = [
  {
    id: "soc",
    icon: Shield,
    basePrice: 2999,
    period: "month",
    priceId: "essential",
  },
  {
    id: "edr",
    icon: Zap,
    basePrice: 15,
    period: "endpoint/month",
    priceId: "professional",
  },
  {
    id: "xdr",
    icon: Lock,
    basePrice: 4999,
    period: "month",
    priceId: "enterprise",
  },
] as const;

const durationOptions = [
  { value: "1", multiplier: 1, discount: 0 },
  { value: "3", multiplier: 3, discount: 0.1 },
  { value: "12", multiplier: 12, discount: 0.2 },
];

const Solutions = () => {
  const t = useTranslations("solutions");
  const { toast } = useToast();

  const { control, watch, handleSubmit } = useForm<FormData>({
    defaultValues: {
      durations: solutions.reduce(
        (acc, solution) => ({
          ...acc,
          [solution.priceId]: "1",
        }),
        {}
      ),
    },
  });

  const selectedDurations = watch("durations");

  const calculatePrice = (basePrice: number, duration: string) => {
    const option = durationOptions.find((opt) => opt.value === duration);
    if (!option) return basePrice;

    const totalBeforeDiscount = basePrice * option.multiplier;
    const discount = totalBeforeDiscount * option.discount;
    return totalBeforeDiscount - discount;
  };

  const addToCart = async (priceId: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: t("cart.error.notLoggedIn.title"),
          description: t("cart.error.notLoggedIn.description"),
          variant: "destructive",
        });
        return;
      }

      const duration = selectedDurations[priceId];
      const service = solutions.find((s) => s.priceId === priceId);

      if (!service) throw new Error("Service not found");

      // ... rest of the cart logic ...

      toast({
        title: t("cart.success.title"),
        description: t("cart.success.description", {
          product: t(`products.${service.id}.name`),
        }),
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: t("cart.error.addFailed.title"),
        description: t("cart.error.addFailed.description"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("header.title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t("header.description")}
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {solutions.map((solution) => {
            const duration = selectedDurations[solution.priceId];
            const price = calculatePrice(solution.basePrice, duration);
            const option = durationOptions.find(
              (opt) => opt.value === duration
            );

            return (
              <div
                key={solution.id}
                className="flex flex-col justify-between rounded-3xl bg-card p-8 ring-1 ring-muted shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-x-4">
                    <solution.icon className="h-8 w-8 text-primary" />
                    <h3 className="text-lg font-semibold leading-8">
                      {t(`products.${solution.id}.name`)}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {t(`products.${solution.id}.description`)}
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
                    {t(`products.${solution.id}.features`).map(
                      (feature: string) => (
                        <li key={feature} className="flex gap-x-3">
                          <span className="text-primary">•</span>
                          {feature}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Pricing and controls */}
                <div className="mt-8">
                  <Controller
                    name={`durations.${solution.priceId}`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("duration.select")} />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {t(`duration.options.${option.value}`)}
                              {option.discount > 0 &&
                                ` (${t("duration.discount", { discount: option.discount * 100 })})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <div className="mt-6">
                    <Button
                      className="w-full"
                      onClick={() => addToCart(solution.priceId)}
                    >
                      {t("cart.addToCart")}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Solutions;
