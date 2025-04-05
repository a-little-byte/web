"use client";

import type { ServiceSelect } from "@/db/models/Service";
import { Check, Lock, Shield, Zap } from "lucide-react";

import { useTranslations } from "next-intl";
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
          ${service.price}{" "}
          <span className="text-sm text-muted-foreground/90">
            / {service.period}
          </span>
        </div>
      </div>
    </div>
  );
};
