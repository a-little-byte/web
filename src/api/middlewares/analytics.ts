import type { PrivateContextVariables } from "@/api/types";
import {
  extractClientIP,
  parseUserAgent,
  shouldTrackRequest,
} from "@/lib/analytics";
import type { MiddlewareHandler } from "hono";

export const analyticsMiddleware: MiddlewareHandler<{
  Variables: PrivateContextVariables;
}> = async (ctx, next) => {
  const startTime = Date.now();
  const {
    var: { db },
  } = ctx;

  // Get request information
  const url = new URL(ctx.req.url);
  const method = ctx.req.method;
  const userAgent = ctx.req.header("user-agent") || null;
  const referer = ctx.req.header("referer") || null;
  const ipAddress = extractClientIP(ctx.req.raw);

  // Parse user agent
  const { browser, os, device_type } = parseUserAgent(userAgent);

  // Get user ID if available from session
  const session = ctx.get("session");
  const userId = session?.user?.id || null;

  await next();

  // Calculate response time
  const responseTime = Date.now() - startTime;
  const statusCode = ctx.res.status;

  // Check if we should track this request
  const shouldTrack = shouldTrackRequest(url.pathname);

  if (shouldTrack) {
    try {
      // Insert analytics data into database
      await db
        .insertInto("analytics")
        .values({
          url: url.pathname + url.search,
          method,
          status_code: statusCode,
          response_time: responseTime,
          user_agent: userAgent,
          ip_address: ipAddress,
          user_id: userId,
          referer,
          country: null, // Could be enhanced with IP geolocation
          city: null, // Could be enhanced with IP geolocation
          device_type,
          browser,
          os,
        })
        .execute();
    } catch (error) {
      // Silently fail analytics tracking to not affect the main request
      console.error("Analytics tracking failed:", error);
    }
  }
};
