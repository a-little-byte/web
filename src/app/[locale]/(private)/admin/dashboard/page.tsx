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
import { supabase } from "@/lib/supabase";
import { format, subDays, subWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
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

// Colors from the brand book
const COLORS = ["#302082", "#FF6B00", "#F2F2F2"];

interface SalesData {
  date: string;
  total: number;
  SOC: number;
  EDR: number;
  XDR: number;
}

interface CategoryData {
  name: string;
  value: number;
}

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);

  useEffect(() => {
    fetchSalesData();
  }, [timeframe]);

  const fetchSalesData = async () => {
    try {
      const endDate = new Date();
      const startDate =
        timeframe === "week" ? subDays(endDate, 7) : subWeeks(endDate, 5);

      const { data: payments, error } = await supabase
        .from("payments")
        .select(
          `
          amount,
          created_at,
          subscriptions (
            services (
              name
            )
          )
        `
        )
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Process data for charts
      const dailyData: { [key: string]: SalesData } = {};
      const categoryTotals: { [key: string]: number } = {
        SOC: 0,
        EDR: 0,
        XDR: 0,
      };

      payments?.forEach((payment) => {
        const date = format(new Date(payment.created_at), "yyyy-MM-dd");
        const serviceName = payment.subscriptions?.services?.name || "Unknown";
        const amount = payment.amount;

        // Initialize daily data if not exists
        if (!dailyData[date]) {
          dailyData[date] = {
            date,
            total: 0,
            SOC: 0,
            EDR: 0,
            XDR: 0,
          };
        }

        // Update daily totals
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

      // Convert to arrays for charts
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

      setSalesData(salesDataArray);
      setCategoryData(categoryDataArray);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de bord des ventes</h1>
        <Select
          value={timeframe}
          onValueChange={(value: "week" | "month") => setTimeframe(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner la période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">7 derniers jours</SelectItem>
            <SelectItem value="month">5 dernières semaines</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Daily Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ventes quotidiennes</CardTitle>
            <CardDescription>Total des ventes par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
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

        {/* Category Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ventes par catégorie</CardTitle>
            <CardDescription>
              Répartition des ventes par service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
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
                    {categoryData.map((entry, index) => (
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

        {/* Average Basket by Category */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Paniers moyens par catégorie</CardTitle>
            <CardDescription>
              Comparaison des ventes par service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
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
}
