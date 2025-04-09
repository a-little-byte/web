"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, subWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#302082", "#FF6B00", "#F2F2F2"] as const;
const TIME_FRAMES = ["week", "month"] as const;

interface SalesData {
  date: string;
  total: number;
  SOC: number;
  EDR: number;
  XDR: number;
}

const Dashboard = () => {
  const t = useTranslations("admin.dashboard");
  const [timeFrame, setTimeFrame] = useQueryState(
    "timeFrame",
    parseAsStringLiteral(TIME_FRAMES).withDefault("week")
  );
  const { data } = useQuery({
    queryKey: ["salesData", timeFrame],
    queryFn: async () => {
      const endDate = new Date();
      const startDate =
        timeFrame === "week" ? subDays(endDate, 7) : subWeeks(endDate, 5);

      const res = await apiClient.payments.$get({
        query: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      const payments = await res.json();

      const dailyData: Record<string, SalesData> = {};
      const categoryTotals: Record<string, number> = {
        SOC: 0,
        EDR: 0,
        XDR: 0,
      };

      payments?.forEach((payment) => {
        const date = format(new Date(payment.createdAt), "yyyy-MM-dd");
        const serviceName = payment.subscription?.service?.name || "Unknown";
        const amount = payment.amount;

        if (!dailyData[date]) {
          dailyData[date] = {
            date,
            total: 0,
            SOC: 0,
            EDR: 0,
            XDR: 0,
          };
        }

        dailyData[date].total += amount;
        if (serviceName.includes("SOC")) {
          dailyData[date].SOC += amount;
          categoryTotals.SOC += amount;
        } else if (serviceName.includes("EDR")) {
          dailyData[date].EDR += amount;
          categoryTotals.EDR += amount;
        } else if (serviceName.includes("XDR")) {
          dailyData[date].XDR += amount;
          categoryTotals.XDR += amount;
        }
      });

      const salesDataArray = Object.values(dailyData).map((data) => ({
        ...data,
        date: format(new Date(data.date), "dd MMM", { locale: fr }),
      }));

      const categoryDataArray = Object.entries(categoryTotals).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

      return { salesData: salesDataArray, categoryData: categoryDataArray };
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Select
          value={timeFrame}
          onValueChange={(value: "week" | "month") => setTimeFrame(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("timeframeSelect")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">{t("lastWeek")}</SelectItem>
            <SelectItem value="month">{t("lastMonth")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dailySales.title")}</CardTitle>
            <CardDescription>{t("dailySales.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#302082" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("categorySales.title")}</CardTitle>
            <CardDescription>{t("categorySales.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data?.categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("averageBasket.title")}</CardTitle>
            <CardDescription>{t("averageBasket.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="SOC" fill="#302082" name="SOC" />
                  <Bar dataKey="EDR" fill="#FF6B00" name="EDR" />
                  <Bar dataKey="XDR" fill="#F2F2F2" name="XDR" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
