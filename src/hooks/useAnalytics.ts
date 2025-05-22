"use client";

import { analytics } from "@/lib/analytics-client";
import { useEffect } from "react";

export const useAnalytics = () => {
  useEffect(() => {
    // Track page view when component mounts
    analytics.trackPageView();
  }, []);

  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackEvent: analytics.trackEvent.bind(analytics),
    track: analytics.track.bind(analytics),
  };
};
