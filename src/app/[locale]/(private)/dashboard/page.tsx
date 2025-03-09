"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface Service {
  name: string;
  price: number;
  period: string;
}

interface Subscription {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  services: Service | null;
}

interface DashboardData {
  subscriptions: Subscription[];
  totalSpent: number;
}

const Dashboard = () => {
  const t = useTranslations("dashboard");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.subscriptions.$get(
          {},
          {
            headers: {
              Authorization: `Bearer ${document.cookie.replace(
                /(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/,
                "$1"
              )}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data: DashboardData = await response.json();

        setSubscriptions(data.subscriptions);
        setTotalSpent(data.totalSpent);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      }
    };

    fetchDashboardData();
  }, [toast]);

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
            <CardHeader>
              <CardTitle>{sub.services?.name || "Unknown Service"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">
                    {t("subscriptionsList.details.status")}:
                  </span>{" "}
                  <span className="capitalize">{sub.status}</span>
                </p>
                {sub.services && (
                  <p>
                    <span className="font-medium">
                      {t("subscriptionsList.details.price")}:
                    </span>{" "}
                    ${sub.services.price}/{sub.services.period}
                  </p>
                )}
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
