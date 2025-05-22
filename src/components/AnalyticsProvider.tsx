"use client";

import { analytics } from "@/lib/analytics-client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const AnalyticsProvider = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on route changes
    analytics.trackPageView();
  }, [pathname]);

  return null; // This component doesn't render anything
};
