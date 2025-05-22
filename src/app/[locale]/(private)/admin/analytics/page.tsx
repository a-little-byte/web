"use client";

import { useAnalyticsData } from "@/app/[locale]/(private)/admin/_hooks/useAnalyticsData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#302082",
  "#FF6B00",
  "#F2F2F2",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
] as const;

const Analytics = () => {
  const t = useTranslations("admin.analytics");

  // Query state for filters
  const [startDate, setStartDate] = useQueryState(
    "startDate",
    parseAsString.withDefault("")
  );
  const [endDate, setEndDate] = useQueryState(
    "endDate",
    parseAsString.withDefault("")
  );
  const [statusCode, setStatusCode] = useQueryState(
    "statusCode",
    parseAsString.withDefault("")
  );
  const [method, setMethod] = useQueryState(
    "method",
    parseAsString.withDefault("")
  );
  const [url, setUrl] = useQueryState("url", parseAsString.withDefault(""));
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsString.withDefault("50")
  );
  const [offset, setOffset] = useQueryState(
    "offset",
    parseAsString.withDefault("0")
  );

  const { data: stats, isLoading: statsLoading } = useAnalyticsData.useStats({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const { data: timeSeries, isLoading: timeSeriesLoading } =
    useAnalyticsData.useTimeSeries({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

  const { data: analytics, isLoading: analyticsLoading } =
    useAnalyticsData.useAnalytics({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      statusCode: statusCode ? Number(statusCode) : undefined,
      method: method || undefined,
      url: url || undefined,
      limit: Number(limit),
      offset: Number(offset),
    });

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatusCode("");
    setMethod("");
    setUrl("");
    setOffset("0");
  };

  const nextPage = () => {
    setOffset(String(Number(offset) + Number(limit)));
  };

  const prevPage = () => {
    setOffset(String(Math.max(0, Number(offset) - Number(limit))));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("filters.title")}</CardTitle>
          <CardDescription>{t("filters.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            data-protonpass-form=""
          >
            <div>
              <Label className="text-sm font-medium">
                {t("filters.startDate")}
              </Label>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                {t("filters.endDate")}
              </Label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                {t("filters.statusCode")}
              </Label>
              <Input
                type="number"
                placeholder="200, 404, 500..."
                value={statusCode}
                onChange={(e) => setStatusCode(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                {t("filters.method")}
              </Label>
              <Select defaultValue={method} onValueChange={setMethod}>
                <SelectTrigger>
                  <SelectValue placeholder={t("filters.selectMethod")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">{t("filters.url")}</Label>
              <Input
                placeholder="/api/users, /admin..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                {t("filters.limit")}
              </Label>
              <Select value={limit} onValueChange={setLimit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={clearFilters} variant="outline">
                {t("filters.clear")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.totalRequests")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.totalRequests.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.avgResponseTime")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading
                ? "..."
                : `${Math.round(stats?.avgResponseTime || 0)}ms`}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.topBrowser")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.browserStats[0]?.browser || "N/A"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.topDevice")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading
                ? "..."
                : stats?.deviceStats[0]?.device_type || "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.statusCodes.title")}</CardTitle>
            <CardDescription>
              {t("charts.statusCodes.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.statusStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status_code, count }) =>
                      `${status_code}: ${count}`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats?.statusStats?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("charts.methods.title")}</CardTitle>
            <CardDescription>{t("charts.methods.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.methodStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#302082" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("charts.timeSeries.title")}</CardTitle>
            <CardDescription>
              {t("charts.timeSeries.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="createdAt" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    stroke="#302082"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("table.title")}</CardTitle>
          <CardDescription>{t("table.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.headers.timestamp")}</TableHead>
                  <TableHead>{t("table.headers.method")}</TableHead>
                  <TableHead>{t("table.headers.url")}</TableHead>
                  <TableHead>{t("table.headers.statusCode")}</TableHead>
                  <TableHead>{t("table.headers.responseTime")}</TableHead>
                  <TableHead>{t("table.headers.device")}</TableHead>
                  <TableHead>{t("table.headers.browser")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {t("table.loading")}
                    </TableCell>
                  </TableRow>
                ) : analytics?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {t("table.noData")}
                    </TableCell>
                  </TableRow>
                ) : (
                  analytics?.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        {new Date(row.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${cn(
                            row.method === "GET" && "bg-blue-100 text-blue-700",
                            row.method === "POST" &&
                              "bg-green-100 text-green-700",
                            row.method === "PUT" &&
                              "bg-yellow-100 text-yellow-700",
                            row.method === "DELETE" &&
                              "bg-red-100 text-red-700",
                            "bg-gray-100 text-gray-700"
                          )}`}
                        >
                          {row.method}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={row.url}>
                        {row.url}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            row.status_code >= 200 &&
                              row.status_code < 300 &&
                              "bg-green-100 text-green-700",
                            row.status_code >= 300 &&
                              row.status_code < 400 &&
                              "bg-yellow-100 text-yellow-700",
                            row.status_code >= 400 &&
                              row.status_code < 500 &&
                              "bg-orange-100 text-orange-700",
                            row.status_code >= 500 && "bg-red-100 text-red-700"
                          )}
                        >
                          {row.status_code}
                        </span>
                      </TableCell>
                      <TableCell>{row.response_time}ms</TableCell>
                      <TableCell>{row.device_type || "Unknown"}</TableCell>
                      <TableCell>{row.browser || "Unknown"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              {t("table.showing")} {Number(offset) + 1} -{" "}
              {Number(offset) + (analytics?.length || 0)} {t("table.of")}{" "}
              {t("table.results")}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={Number(offset) === 0}
              >
                {t("table.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={!analytics || analytics.length < Number(limit)}
              >
                {t("table.next")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
