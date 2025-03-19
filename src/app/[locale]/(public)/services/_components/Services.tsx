"use client";

import { AddToCartForm } from "@/app/[locale]/(public)/services/_components/AddToCartForm";
import type { ServiceSelect } from "@/db/models/Service";
import { useForm } from "@/hooks/useForm";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const servicesFormSchema = z.object({
  durations: z.record(z.string(), z.string()),
});

export const Services = ({ services }: { services: ServiceSelect[] }) => {
  const form = useForm(servicesFormSchema);

  return services.map((service) => (
    <Service key={service.id} service={service} form={form} />
  ));
};

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

export const Service = ({
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
  const duration = form.watch("durations")[service.id];
  const price = calculatePrice(service.price, duration);

  return (
    <div
      key={service.id}
      className="flex flex-col justify-between rounded-3xl bg-card p-8 ring-1 ring-muted shadow-sm"
    >
      <div>
        <div className="flex items-center gap-x-4">
          {/* <service.icon className="h-8 w-8 text-primary" /> */}
          <h3 className="text-lg font-semibold leading-8">{service.name}</h3>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {service.description}
        </p>
        <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
          {/* {service.features.map((feature: string) => (
            <li key={feature} className="flex gap-x-3">
              <Check className="h-5 w-5 text-primary" />
              {feature}
            </li>
          ))} */}
        </ul>
      </div>

      <div className="mt-4">
        <div className="text-2xl font-bold mb-3">
          ${price.toFixed(2)}{" "}
          <span className="text-sm text-muted-foreground/90">
            / {service.period}
          </span>
        </div>

        <AddToCartForm service={service} form={form} />
      </div>
    </div>
  );
};
