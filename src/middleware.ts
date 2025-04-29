import { routing } from "@/lib/i18n/routing";
import createMiddleware from "next-intl/middleware";

export const middleware = createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/", "/(fr|en)/:path*"],
};
