import { routing } from "@/lib/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export const middleware = async (request: NextRequest) => {
  const startTime = Date.now();

  // Run internationalization middleware first
  const response = intlMiddleware(request);

  // Track analytics after i18n processing
  const url = new URL(request.url);
  const method = request.method;
  const userAgent = request.headers.get("user-agent");
  const referer = request.headers.get("referer");

  // Calculate response time
  const responseTime = Date.now() - startTime;
  const statusCode = response?.status || 200;

  // Check if we should track this request (basic check to avoid unnecessary API calls)
  const skipPatterns = [
    "/_next/",
    "/api/analytics", // Don't track analytics API calls
    "/favicon.ico",
    "/.well-known/",
    "/robots.txt",
    "/sitemap.xml",
    "/sw.js",
    "/manifest.json",
    "/_vercel/",
    "/assets/",
    "/images/",
    "/icons/",
    ".css",
    ".js",
    ".map",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
  ];

  const shouldTrack = !skipPatterns.some((pattern) =>
    url.pathname.includes(pattern)
  );

  if (shouldTrack) {
    // Track analytics asynchronously using API endpoint
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || `http://localhost:3000`;

      await fetch(`${baseUrl}/api/analytics/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.pathname + url.search,
          method,
          status_code: statusCode,
          response_time: responseTime,
          user_agent: userAgent,
          referer,
          user_id: null, // Frontend requests don't have user context
        }),
      });
    } catch (error) {
      console.error("Analytics tracking failed:", error);
    }
  }

  return response;
};

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/", "/(fr|en)/:path*"],
};
