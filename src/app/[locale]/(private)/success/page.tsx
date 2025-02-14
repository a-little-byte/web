"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderDetails {
  id: string;
  amount: number;
  status: string;
  services: Array<{
    name: string;
    quantity: number;
    price: number;
    period: string;
  }>;
}

export default function Success() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!sessionId) return;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const { data: orderData, error } = await supabase
          .from("payments")
          .select(
            `
            id,
            amount,
            status,
            subscriptions (
              services (
                name,
                price,
                period
              )
            )
          `
          )
          .eq("stripe_session_id", sessionId)
          .single();

        if (error) throw error;

        if (orderData) {
          setOrder({
            id: orderData.id,
            amount: orderData.amount,
            status: orderData.status,
            services: orderData.subscriptions.services,
          });
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container max-w-2xl py-20">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Order Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              We couldn't find the order details. Please contact support if you
              believe this is an error.
            </p>
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-20">
      <Card>
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl font-bold">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div className="mt-4 space-y-4">
              <h3 className="font-semibold">Order Summary</h3>
              <div className="divide-y">
                {order.services.map((service, index) => (
                  <div key={index} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${service.price}/{service.period}
                      </p>
                    </div>
                    <p className="font-medium">x{service.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-between">
                <p className="font-semibold">Total Amount</p>
                <p className="font-semibold">${order.amount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              A confirmation email has been sent to your registered email
              address.
            </p>
            <p className="text-muted-foreground">
              You can manage your subscriptions from your dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/subscriptions">View Subscriptions</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
