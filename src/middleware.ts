import { routing } from "@/lib/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export const middleware = async (request: NextRequest) => {
  const authResponse = await updateSession(request);

  if (authResponse.headers.get("location")) {
    return authResponse;
  }

  return intlMiddleware(request);
};

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/", "/(fr|en)/:path*"],
};
