"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { useState } from "react";

const tiers = [
  {
    name: "Essential",
    id: "essential",
    price: "$2,999",
    description: "Essential security coverage for small to medium businesses.",
    features: [
      "SOC monitoring (business hours)",
      "Basic EDR protection",
      "Email security",
      "Vulnerability scanning",
      "8x5 support",
    ],
  },
  {
    name: "Professional",
    id: "professional",
    price: "$4,999",
    description: "Advanced security for growing organizations.",
    features: [
      "24/7 SOC monitoring",
      "Advanced EDR/XDR",
      "SIEM integration",
      "Threat hunting",
      "Incident response",
      "24/7 support",
    ],
  },
  {
    name: "Enterprise",
    id: "enterprise",
    price: "Custom",
    description: "Comprehensive security for large enterprises.",
    features: [
      "Custom SOC solutions",
      "Advanced XDR platform",
      "Custom integrations",
      "Dedicated security team",
      "Custom SLAs",
      "Priority 24/7 support",
    ],
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCheckout = async (priceId: string) => {
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
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
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
            Pricing Plans
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the right security package for your business. All plans
            include our core security features and expert support.
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
                  {tier.price !== "Custom" && (
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
              <Button
                className="mt-8 w-full"
                onClick={() => handleCheckout(tier.id)}
                disabled={loading === tier.id}
              >
                {loading === tier.id ? "Processing..." : "Subscribe Now"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
