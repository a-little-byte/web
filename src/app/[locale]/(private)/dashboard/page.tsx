"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/supabase/types";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const supabase = createClient();
  const t = useTranslations("dashboard");
  const [subscriptions, setSubscriptions] = useState<Tables<"subscriptions">[]>(
    []
  );
  const [totalSpent, setTotalSpent] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const decoded = JSON.parse(atob(token.split(".")[1]));

      const { data: subs } = await supabase
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
  `
        )
        .eq("user_id", decoded.userId)
        .eq("status", "active")
        .throwOnError();

      const { data: payments } = await supabase
        .from("payments")
        .select(
          `
    amount,
    subscriptions!inner (
      id
    )
  `
        )
        .eq("subscriptions.user_id", decoded.userId)
        .throwOnError();

      if (!payments || !subs) {
        toast({});
        return;
      }

      setTotalSpent(
        payments.reduce((sum, payment) => sum + Number(payment.amount), 0)
      );
      setSubscriptions(subs as any);
    };

    fetchSubscriptions();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 lowercase first-letter:uppercase">
        {t("title")}
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("cards.activeSubscriptions.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{subscriptions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("cards.totalSpent.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">
        {t("subscriptionsList.title")}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {subscriptions.map((sub) => (
          <Card key={sub.id}>
            <CardHeader>{/* <CardTitle>{sub.}</CardTitle> */}</CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">
                    {t("subscriptionsList.details.status")}:
                  </span>{" "}
                  <span className="capitalize">{sub.status}</span>
                </p>
                <p>
                  <span className="font-medium">
                    {t("subscriptionsList.details.price")}:
                  </span>{" "}
                  {/* ${sub.services.price}/{sub.services.period} */}
                </p>
                <p>
                  <span className="font-medium">
                    {t("subscriptionsList.details.currentPeriod")}:
                  </span>{" "}
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
};

export default Dashboard;
