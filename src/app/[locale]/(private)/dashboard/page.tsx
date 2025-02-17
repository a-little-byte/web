"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase, Tables } from "@/lib/supabase";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState<Tables<"subscriptions">[]>(
    [],
  );
  const [totalSpent, setTotalSpent] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
      const decoded = JSON.parse(atob(token.split(".")[1]));

      const { data: subs, error: subsError } = await supabase
        .from("subscriptions")
        .select(
          `
    id,
    status,
    current_period_start,
    current_period_end,
    services (
      name,
      price,
      period
    )
  `,
        )
        .eq("user_id", decoded.userId)
        .eq("status", "active");

      const { data: payments, error: paymentsError } = await supabase
        .from("payments")
        .select(
          `
    amount,
    subscriptions!inner (
      id
    )
  `,
        )
        .eq("subscriptions.user_id", decoded.userId);

      if (!payments || !subs) {
        toast({});
        return;
      }

      setTotalSpent(
        payments.reduce((sum, payment) => sum + Number(payment.amount), 0),
      );
      setSubscriptions(subs as any);
    };

    fetchSubscriptions();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{subscriptions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">Active Subscriptions</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {subscriptions.map((sub) => (
          <Card key={sub.id}>
            <CardHeader>{/* <CardTitle>{sub.}</CardTitle> */}</CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="capitalize">{sub.status}</span>
                </p>
                <p>
                  <span className="font-medium">Price:</span> $
                  {/* {sub.}/{sub.service_period} */}
                </p>
                <p>
                  <span className="font-medium">Current Period:</span>{" "}
                  {format(new Date(sub.current_period_start), "PP")} -{" "}
                  {format(new Date(sub.current_period_end), "PP")}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
