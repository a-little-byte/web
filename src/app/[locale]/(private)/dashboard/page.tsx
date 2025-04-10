"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@/hooks/useQuery";
import { apiClient } from "@/lib/apiClient";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

const Dashboard = () => {
  const t = useTranslations("dashboard");
  const { data } = useQuery(apiClient.subscriptions);

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
            <p className="text-3xl font-bold">
              {data?.subscriptions?.length ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("cards.totalSpent.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${(data?.totalSpent ?? 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">
        {t("subscriptionsList.title")}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {data?.subscriptions
          ? data.subscriptions.map((sub) => (
              <Card key={sub.id}>
                <CardHeader>
                  <CardTitle>
                    {sub.services?.name ||
                      t("subscriptionsList.unknownService")}
                  </CardTitle>
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
            ))
          : null}
      </div>
    </div>
  );
};

export default Dashboard;
