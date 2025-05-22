"use client";

interface AnalyticsData {
  url: string;
  method: string;
  status_code: number;
  response_time: number;
  user_agent: string | null;
  referer: string | null;
  user_id?: string | null;
}

class ClientAnalytics {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000");
  }

  async track(data: Partial<AnalyticsData>) {
    if (typeof window === "undefined") return; // Only run on client side

    const fullData: AnalyticsData = {
      url: data.url || window.location.pathname + window.location.search,
      method: data.method || "GET",
      status_code: data.status_code || 200,
      response_time: data.response_time || 0,
      user_agent: data.user_agent || navigator.userAgent,
      referer: data.referer || document.referrer || null,
      user_id: data.user_id || null,
    };

    try {
      await fetch(`${this.baseUrl}/api/analytics/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullData),
      });
    } catch (error) {
      console.error("Analytics tracking failed:", error);
    }
  }

  trackPageView(additionalData?: Partial<AnalyticsData>) {
    this.track({
      method: "GET",
      status_code: 200,
      response_time: 0,
      ...additionalData,
    });
  }

  trackEvent(eventType: string, additionalData?: Partial<AnalyticsData>) {
    this.track({
      url: `${window.location.pathname}?event=${eventType}`,
      method: "EVENT",
      status_code: 200,
      response_time: 0,
      ...additionalData,
    });
  }
}

export const analytics = new ClientAnalytics();
