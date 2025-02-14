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
import { useState } from "react";

const solutions = [
  {
    name: "SOC as a Service",
    description:
      "Our Security Operations Center (SOC) provides 24/7 monitoring, threat detection, and incident response for your organization.",
    features: [
      "24/7 Security Monitoring",
      "Real-time Threat Detection",
      "Incident Response",
      "Compliance Reporting",
      "Security Analytics",
    ],
    icon: Shield,
    basePrice: 2999,
    period: "month",
    priceId: "essential",
  },
  {
    name: "EDR Protection",
    description:
      "Advanced Endpoint Detection and Response solution that protects your devices from sophisticated cyber threats.",
    features: [
      "Real-time Protection",
      "Behavioral Analysis",
      "Automated Response",
      "Device Control",
      "Threat Hunting",
    ],
    icon: Zap,
    basePrice: 15,
    period: "endpoint/month",
    priceId: "professional",
  },
  {
    name: "XDR Platform",
    description:
      "Extended Detection and Response platform that unifies security data across your entire technology stack.",
    features: [
      "Cross-platform Protection",
      "Advanced Analytics",
      "Automated Workflows",
      "Threat Intelligence",
      "Custom Reporting",
    ],
    icon: Lock,
    basePrice: 4999,
    period: "month",
    priceId: "enterprise",
  },
];

const durationOptions = [
  { value: "1", label: "1 Month", multiplier: 1, discount: 0 },
  { value: "3", label: "3 Months", multiplier: 3, discount: 0.1 }, // 10% discount
  { value: "12", label: "1 Year", multiplier: 12, discount: 0.2 }, // 20% discount
];

export default function Solutions() {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedDurations, setSelectedDurations] = useState<{
    [key: string]: string;
  }>({});
  const { toast } = useToast();

  const calculatePrice = (basePrice: number, duration: string) => {
    const option = durationOptions.find((opt) => opt.value === duration);
    if (!option) return basePrice;

    const totalBeforeDiscount = basePrice * option.multiplier;
    const discount = totalBeforeDiscount * option.discount;
    return totalBeforeDiscount - discount;
  };

  const handleDurationChange = (priceId: string, duration: string) => {
    setSelectedDurations((prev) => ({
      ...prev,
      [priceId]: duration,
    }));
  };

  const addToCart = async (priceId: string) => {
    setLoading(priceId);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Not logged in",
          description: "Please sign in to add items to your cart",
          variant: "destructive",
        });
        return;
      }

      const duration = selectedDurations[priceId] || "1";
      const service = solutions.find((s) => s.priceId === priceId);

      if (!service) {
        throw new Error("Service not found");
      }

      // Check if item already exists in cart
      const { data: existingItems } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("service_id", priceId)
        .single();

      if (existingItems) {
        // Update existing cart item
        const { error } = await supabase
          .from("cart_items")
          .update({
            quantity: existingItems.quantity + 1,
            duration: parseInt(duration),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingItems.id);

        if (error) throw error;
      } else {
        // Add new cart item
        const { error } = await supabase.from("cart_items").insert([
          {
            user_id: session.user.id,
            service_id: priceId,
            quantity: 1,
            duration: parseInt(duration),
          },
        ]);

        if (error) throw error;
      }

      toast({
        title: "Added to cart",
        description: `${service.name} has been added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
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
            Security Solutions
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the security solution that best fits your organization's
            needs. All our products come with enterprise-grade support and SLA
            guarantees.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {solutions.map((solution) => {
            const duration = selectedDurations[solution.priceId] || "1";
            const price = calculatePrice(solution.basePrice, duration);
            const option = durationOptions.find(
              (opt) => opt.value === duration
            );

            return (
              <div
                key={solution.name}
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
                    {solution.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <span className="text-primary">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <div className="mb-4">
                    <Select
                      value={duration}
                      onValueChange={(value) =>
                        handleDurationChange(solution.priceId, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}{" "}
                            {option.discount > 0 &&
                              `(${option.discount * 100}% off)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold">
                      ${price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      for {option?.label}
                    </span>
                  </p>
                  {option?.discount > 0 && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Save $
                      {(
                        solution.basePrice *
                        option.multiplier *
                        option.discount
                      ).toLocaleString()}
                    </p>
                  )}
                  <Button
                    className="mt-6 w-full"
                    onClick={() => addToCart(solution.priceId)}
                    disabled={loading === solution.priceId}
                  >
                    {loading === solution.priceId
                      ? "Adding to Cart..."
                      : "Add to Cart"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
