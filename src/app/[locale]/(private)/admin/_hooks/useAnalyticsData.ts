import { apiClient } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

interface AnalyticsQueryParams {
  startDate?: string;
  endDate?: string;
  statusCode?: number;
  method?: string;
  url?: string;
  limit?: number;
  offset?: number;
}

interface AnalyticsStatsParams {
  startDate?: string;
  endDate?: string;
}

interface AnalyticsTimeSeriesParams {
  startDate?: string;
  endDate?: string;
}

interface AnalyticsRecord {
  id: string;
  url: string;
  method: string;
  status_code: number;
  response_time: number;
  user_agent: string | null;
  ip_address: string | null;
  user_id: string | null;
  referer: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  createdAt: string;
}

interface AnalyticsStats {
  totalRequests: number;
  statusStats: Array<{ status_code: number; count: number }>;
  methodStats: Array<{ method: string; count: number }>;
  topPages: Array<{ url: string; count: number }>;
  browserStats: Array<{ browser: string; count: number }>;
  deviceStats: Array<{ device_type: string; count: number }>;
  avgResponseTime: number;
}

interface AnalyticsTimeSeries {
  createdAt: string;
  requests: number;
  avg_response_time: number;
}

const useAnalytics = (params: AnalyticsQueryParams) =>
  useQuery({
    queryKey: ["analytics", params],
    queryFn: async (): Promise<AnalyticsRecord[]> => {
      const res = await apiClient.analytics.$get({
        query: params,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      return (await res.json()) as AnalyticsRecord[];
    },
  });

const useStats = (params: AnalyticsStatsParams) =>
  useQuery({
    queryKey: ["analytics", "stats", params],
    queryFn: async (): Promise<AnalyticsStats> => {
      const res = await apiClient.analytics.stats.$get({
        query: params,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch analytics stats");
      }

      return (await res.json()) as AnalyticsStats;
    },
  });

const useTimeSeries = (params: AnalyticsTimeSeriesParams) =>
  useQuery({
    queryKey: ["analytics", "timeseries", params],
    queryFn: async (): Promise<AnalyticsTimeSeries[]> => {
      const res = await apiClient.analytics.timeseries.$get({
        query: params,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch analytics time series");
      }

      return (await res.json()) as AnalyticsTimeSeries[];
    },
  });

export const useAnalyticsData = {
  useAnalytics,
  useStats,
  useTimeSeries,
};
