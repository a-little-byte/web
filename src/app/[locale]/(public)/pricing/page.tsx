"use client";

import { Form } from "@/components/base/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/hooks/useForm";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

const tierIdValidator = z.enum(["essential", "professional", "enterprise"]);

const subscriptionFormSchema = z.object({
  tierId: tierIdValidator,
});

const Pricing = () => {
  const t = useTranslations("pricing");
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm(subscriptionFormSchema);

  const tiers: {
    name: string;
    id: z.infer<typeof tierIdValidator>;
    price: string;
    description: string;
    features: string[];
  }[] = [
    {
      name: t("tiers.essential.name"),
      id: "essential",
      price: t("tiers.essential.price"),
      description: t("tiers.essential.description"),
      features: t(
        "tiers.essential.features",
        {},
        { returnObjects: true }
      ) as string[],
    },
    {
      name: t("tiers.professional.name"),
      id: "professional",
      price: t("tiers.professional.price"),
      description: t("tiers.professional.description"),
      features: t(
        "tiers.professional.features",
        {},
        { returnObjects: true }
      ) as string[],
    },
    {
      name: t("tiers.enterprise.name"),
      id: "enterprise",
      price: t("tiers.enterprise.price"),
      description: t("tiers.enterprise.description"),
      features: t(
        "tiers.enterprise.features",
        {},
        { returnObjects: true }
      ) as string[],
    },
  ];

  const onSubmit = async (priceId: string) => {
    setLoading(priceId);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      toast({
        title: t("errors.checkoutFailed.title"),
        description: t("errors.checkoutFailed.description"),
        variant: "destructive",
      });
    } finally {
      setLoading(null);
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
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="flex flex-col justify-between rounded-3xl bg-card p-8 ring-1 ring-muted shadow-sm"
            >
              <div>
                <h3 className="text-lg font-semibold leading-8">{tier.name}</h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.price !== t("tiers.enterprise.price") && (
                    <span className="text-sm text-muted-foreground">
                      /month
                    </span>
                  )}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-5 w-5 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Form form={form} onSubmit={() => onSubmit(tier.id)}>
                <Button
                  className="mt-8 w-full"
                  type="submit"
                  disabled={loading === tier.id}
                >
                  {loading === tier.id
                    ? t("buttons.processing")
                    : t("buttons.subscribe")}
                </Button>
              </Form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
