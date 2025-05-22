import { checkPermissions } from "@/api/middlewares/checkPermissions";
import { PrivateContextVariables, PublicContextVariables } from "@/api/types";
import {
  extractClientIP,
  parseUserAgent,
  shouldTrackRequest,
} from "@/lib/analytics";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const analyticsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.coerce.number().min(1).max(1000).default(100),
  offset: z.coerce.number().min(0).default(0),
  statusCode: z.coerce.number().optional(),
  method: z.string().optional(),
  url: z.string().optional(),
});

const trackingSchema = z.object({
  url: z.string(),
  method: z.string(),
  status_code: z.number(),
  response_time: z.number(),
  user_agent: z.string().nullable(),
  referer: z.string().nullable(),
  user_id: z.string().nullable().optional(),
});

export const analyticsRouter = new Hono<{
  Variables: PrivateContextVariables;
}>()
  .get(
    "/",
    checkPermissions("analytics.read"),
    zValidator("query", analyticsQuerySchema),
    async ({ var: { db }, json, req }) => {
      const { startDate, endDate, limit, offset, statusCode, method, url } =
        req.valid("query");

      let query = db
        .selectFrom("analytics")
        .select([
          "id",
          "url",
          "method",
          "status_code",
          "response_time",
          "user_agent",
          "ip_address",
          "user_id",
          "referer",
          "country",
          "city",
          "device_type",
          "browser",
          "os",
          "createdAt",
        ])
        .orderBy("createdAt", "desc");

      // Apply filters
      if (startDate) {
        query = query.where("createdAt", ">=", new Date(startDate));
      }
      if (endDate) {
        query = query.where("createdAt", "<=", new Date(endDate));
      }
      if (statusCode) {
        query = query.where("status_code", "=", statusCode);
      }
      if (method) {
        query = query.where("method", "=", method);
      }
      if (url) {
        query = query.where("url", "like", `%${url}%`);
      }

      const analytics = await query.limit(limit).offset(offset).execute();

      return json(analytics);
    }
  )

  // Get analytics summary/stats
  .get(
    "/stats",
    checkPermissions("analytics.read"),
    zValidator(
      "query",
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    ),
    async ({ var: { db }, json, req }) => {
      const { startDate, endDate } = req.valid("query");

      let baseQuery = db.selectFrom("analytics");

      if (startDate) {
        baseQuery = baseQuery.where("createdAt", ">=", new Date(startDate));
      }
      if (endDate) {
        baseQuery = baseQuery.where("createdAt", "<=", new Date(endDate));
      }

      // Get total requests
      const totalRequests = await baseQuery
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst();

      // Get requests by status code
      const statusStats = await baseQuery
        .select(["status_code", db.fn.countAll().as("count")])
        .groupBy("status_code")
        .orderBy("count", "desc")
        .execute();

      // Get requests by method
      const methodStats = await baseQuery
        .select(["method", db.fn.countAll().as("count")])
        .groupBy("method")
        .orderBy("count", "desc")
        .execute();

      // Get top pages
      const topPages = await baseQuery
        .select(["url", db.fn.countAll().as("count")])
        .groupBy("url")
        .orderBy("count", "desc")
        .limit(10)
        .execute();

      // Get browsers
      const browserStats = await baseQuery
        .select(["browser", db.fn.countAll().as("count")])
        .where("browser", "is not", null)
        .groupBy("browser")
        .orderBy("count", "desc")
        .execute();

      // Get device types
      const deviceStats = await baseQuery
        .select(["device_type", db.fn.countAll().as("count")])
        .where("device_type", "is not", null)
        .groupBy("device_type")
        .orderBy("count", "desc")
        .execute();

      // Get average response time
      const avgResponseTime = await baseQuery
        .select(db.fn.avg("response_time").as("avg_response_time"))
        .executeTakeFirst();

      return json({
        totalRequests: Number(totalRequests?.count || 0),
        statusStats,
        methodStats,
        topPages,
        browserStats,
        deviceStats,
        avgResponseTime: Number(avgResponseTime?.avg_response_time || 0),
      });
    }
  )

  // Get simple time-series data for charts
  .get(
    "/timeseries",
    checkPermissions("analytics.read"),
    zValidator(
      "query",
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    ),
    async ({ var: { db }, json, req }) => {
      const { startDate, endDate } = req.valid("query");

      let baseQuery = db.selectFrom("analytics");

      if (startDate) {
        baseQuery = baseQuery.where("createdAt", ">=", new Date(startDate));
      }
      if (endDate) {
        baseQuery = baseQuery.where("createdAt", "<=", new Date(endDate));
      }

      // Get simplified time-series data - return individual records for client-side grouping
      const timeSeries = await baseQuery
        .select(["createdAt", "response_time"])
        .orderBy("createdAt", "asc")
        .execute();

      // Process data into hourly buckets on the server side
      const groupedData = timeSeries.reduce(
        (acc, record) => {
          const hour =
            new Date(record.createdAt).toISOString().slice(0, 13) +
            ":00:00.000Z";

          if (!acc[hour]) {
            acc[hour] = {
              timestamp: hour,
              requests: 0,
              total_response_time: 0,
            };
          }

          acc[hour].requests += 1;
          acc[hour].total_response_time += record.response_time;

          return acc;
        },
        {} as Record<
          string,
          { timestamp: string; requests: number; total_response_time: number }
        >
      );

      // Convert to array and calculate averages
      const processedTimeSeries = Object.values(groupedData).map((group) => ({
        createdAt: group.timestamp,
        requests: group.requests,
        avg_response_time:
          group.requests > 0 ? group.total_response_time / group.requests : 0,
      }));

      return json(processedTimeSeries);
    }
  )

  // Delete analytics data (admin only)
  .delete(
    "/",
    checkPermissions("analytics.delete"),
    zValidator(
      "query",
      z.object({
        beforeDate: z.string(),
      })
    ),
    async ({ var: { db }, json, req }) => {
      const { beforeDate } = req.valid("query");

      const result = await db
        .deleteFrom("analytics")
        .where("createdAt", "<", new Date(beforeDate))
        .execute();

      return json({ deleted: Number(result[0]?.numDeletedRows || 0) });
    }
  );

export const analyticsPublicRouter = new Hono<{
  Variables: PublicContextVariables;
}>().post(
  "/track",
  zValidator("json", trackingSchema),
  async ({ var: { db }, json, req }) => {
    const data = req.valid("json");

    // Check if we should track this request
    if (!shouldTrackRequest(data.url)) {
      return json({ success: false, message: "Request not tracked" });
    }

    try {
      // Extract IP from the current request (the tracking request)
      const ipAddress = extractClientIP(req.raw);

      // Parse user agent
      const { browser, os, device_type } = parseUserAgent(data.user_agent);

      // Insert analytics data into database
      await db
        .insertInto("analytics")
        .values({
          url: data.url,
          method: data.method,
          status_code: data.status_code,
          response_time: data.response_time,
          user_agent: data.user_agent,
          ip_address: ipAddress,
          user_id: (data.user_id as any) || null,
          referer: data.referer,
          country: null,
          city: null,
          device_type,
          browser,
          os,
        })
        .execute();

      return json({ success: true });
    } catch (error) {
      console.error("Analytics tracking failed:", error);
      return json({ success: false, message: "Tracking failed" }, 500);
    }
  }
);
