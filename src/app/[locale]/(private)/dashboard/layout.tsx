"use client";

import ScrambleHover from "@/components/ui/scramble";
import { Link, usePathname, useRouter } from "@/lib/i18n/routing";
import { cn } from "@/lib/style";
import { CreditCard, Home, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect, useMemo } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const t = useTranslations("navigation");
  const pathname = usePathname();

  const SIDEBAR: Array<{ href: string; children: ReactNode }> = useMemo(
    () => [
      {
        href: "/dashboard",
        children: (
          <>
            <Home className="h-4 w-4" />
            {t("overview")}
          </>
        ),
      },
      {
        href: "/dashboard/order-history",
        children: (
          <>
            <CreditCard className="h-4 w-4" />
            {t("orderHistory")}
          </>
        ),
      },
      {
        href: "/dashboard/settings",
        children: (
          <>
            <Settings className="h-4 w-4" />
            {t("settings")}
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (!token) {
      router.push("/auth/login");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-card border-r">
        <nav className="p-4 space-y-2">
          <h2 className="text-lg font-semibold mb-4">
            <ScrambleHover
              text={t("dashboard")}
              sequential={true}
              revealDirection="start"
              useOriginalCharsOnly={false}
              className="font-azeretMono"
            />
          </h2>
          {SIDEBAR.map(({ href, children: childrenLink }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 p-2 hover:bg-muted rounded-md",
                pathname === href && "bg-muted"
              )}
            >
              {childrenLink}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
