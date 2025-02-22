"use client";

import { Form } from "@/components/base/Form";
import { SelectField } from "@/components/base/SelectField";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { createClient } from "@/lib/supabase/client";
import { Check, Lock, LucideIcon, Shield, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { z } from "zod";

//cuicui.day/marketing-ui/pricing-tables

const durationOptions = [
  { value: "1", multiplier: 1, discount: 0 },
  { value: "3", multiplier: 3, discount: 0.1 },
  { value: "12", multiplier: 12, discount: 0.2 },
];

type PriceIds = "essential" | "professional" | "enterprise";

const formSchema = z.object({
  durations: z.object({
    essential: z.string(),
    professional: z.string(),
    enterprise: z.string(),
  }),
});

const calculatePrice = (basePrice: number, duration: string) => {
  const option = durationOptions.find((opt) => opt.value === duration);
  if (!option) return basePrice;

  const totalBeforeDiscount = basePrice * option.multiplier;
  const discount = totalBeforeDiscount * option.discount;
  return totalBeforeDiscount - discount;
};

const Services = () => {
  const { locale } = useParams();
  const supabase = createClient();
  const t = useTranslations("services");
  const { toast } = useToast();
  const solutions = useMemo<
    Array<{
      id: string;
      icon: LucideIcon;
      name: string;
      description: string;
      features: string[];
      basePrice: number;
      period: string;
      priceId: PriceIds;
    }>
  >(
    () =>
      [
        {
          id: "soc",
          icon: Shield,
          name: t("products.soc.name"),
          description: t("products.soc.description"),
          features: t.raw("products.soc.features"),
          basePrice: 2999,
          period: "month",
          priceId: "essential",
        },
        {
          id: "edr",
          icon: Zap,
          name: t("products.edr.name"),
          description: t("products.edr.description"),
          features: t.raw("products.edr.features"),
          basePrice: 15,
          period: "endpoint/month",
          priceId: "professional",
        },
        {
          id: "xdr",
          icon: Lock,
          name: t("products.xdr.name"),
          description: t("products.xdr.description"),
          features: t.raw("products.xdr.features"),
          basePrice: 4999,
          period: "month",
          priceId: "enterprise",
        },
      ] as const,
    [locale]
  );
  const form = useForm(formSchema, {
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
  const selectedDurations = form.watch("durations");

  const addToCart = async (
    values: z.infer<typeof formSchema>,
    priceId: PriceIds
  ) => {
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

      const duration = values.durations[priceId];
      const service = solutions.find((s) => s.priceId === priceId);

      if (!service) throw new Error("Service not found");

      const { data } = await supabase
        .from("services")
        .select()
        .eq("name", service.id)
        .single();

      const { error } = await supabase.from("cart_items").insert({
        user_id: session.user.id,
        service_id: data.id,
        quantity: 1,
      });

      if (error) throw error;

      toast({
        title: t("cart.success.title"),
        description: t("cart.success.description", {
          product: service.name,
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

            return (
              <div
                key={solution.id}
                className="flex flex-col justify-between rounded-3xl bg-card p-8 ring-1 ring-muted shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-x-4">
                    <solution.icon className="h-8 w-8 text-primary" />
                    <h3 className="text-lg font-semibold leading-8">
                      {solution.name}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {solution.description}
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
                    {solution.features.map((feature: string) => (
                      <li key={feature} className="flex gap-x-3">
                        <Check className="h-5 w-5 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <div className="text-2xl font-bold mb-3">
                    ${price.toFixed(2)}{" "}
                    <span className="text-sm text-muted-foreground/90">
                      / {solution.period}
                    </span>
                  </div>

                  <Form
                    form={form}
                    onSubmit={(values) => addToCart(values, solution.priceId)}
                  >
                    <SelectField
                      control={form.control}
                      name={`durations.${solution.priceId}`}
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;
