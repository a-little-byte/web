import { apiClient } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, subWeeks } from "date-fns";
import { fr } from "date-fns/locale";

interface SalesData {
  date: string;
  total: number;
  SOC: number;
  EDR: number;
  XDR: number;
}

export const useSalesData = (timeFrame: "week" | "month") =>
  useQuery({
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
