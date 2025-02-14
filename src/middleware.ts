import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

async function authMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token");

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const authResponse = await authMiddleware(request);

  if (authResponse.headers.get("location")) {
    return authResponse;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/", "/(fr|en)/:path*"],
};
