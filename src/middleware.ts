import { routing } from "@/lib/i18n/routing";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export const middleware = async (request: NextRequest) => {
  return intlMiddleware(request);
};

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/", "/(fr|en)/:path*"],
};
