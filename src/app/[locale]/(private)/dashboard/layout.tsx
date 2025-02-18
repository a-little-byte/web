"use client";

import { Link, useRouter } from "@/i18n/routing";
import { CreditCard, Home, Settings } from "lucide-react";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-card border-r">
        <nav className="p-4 space-y-2">
          <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
          >
            <Home className="h-4 w-4" />
            Overview
          </Link>
          <Link
            href="/dashboard/subscriptions"
            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
          >
            <CreditCard className="h-4 w-4" />
            Subscriptions
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
