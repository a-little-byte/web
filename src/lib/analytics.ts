export interface ParsedUserAgent {
  browser: string | null;
  os: string | null;
  device_type: "mobile" | "tablet" | "desktop" | null;
}

export const parseUserAgent = (userAgent: string | null): ParsedUserAgent => {
  if (!userAgent) {
    return { browser: null, os: null, device_type: null };
  }

  // Simple user agent parsing
  let browser = null;
  let os = null;
  let device_type: "mobile" | "tablet" | "desktop" | null = null;

  // Detect browser
  if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    browser = "Safari";
  else if (userAgent.includes("Edge")) browser = "Edge";
  else if (userAgent.includes("Opera")) browser = "Opera";

  // Detect OS
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (
    userAgent.includes("iOS") ||
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad")
  )
    os = "iOS";

  // Detect device type
  if (
    userAgent.includes("Mobile") ||
    (userAgent.includes("Android") && !userAgent.includes("Tablet"))
  ) {
    device_type = "mobile";
  } else if (userAgent.includes("Tablet") || userAgent.includes("iPad")) {
    device_type = "tablet";
  } else {
    device_type = "desktop";
  }

  return { browser, os, device_type };
};

export const extractClientIP = (request: Request): string | null => {
  // Try various headers for client IP
  const headers = request.headers;

  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return xForwardedFor.split(",")[0]?.trim() || null;
  }

  const xRealIP = headers.get("x-real-ip");
  if (xRealIP) return xRealIP;

  const cfConnectingIP = headers.get("cf-connecting-ip");
  if (cfConnectingIP) return cfConnectingIP;

  return null;
};

export const shouldTrackRequest = (url: string): boolean => {
  // Don't track static assets, API internals, etc.
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

  return !skipPatterns.some((pattern) => url.includes(pattern));
};
