import { apiConfig } from "@/api/config";
import { authMiddleware } from "@/api/middlewares";
import {
  authRouter,
  cartRouter,
  chatRouter,
  checkoutRouter,
  heroRouter,
  ordersRouter,
  sendRouter,
  subscriptionsRouter,
} from "@/api/routes";
import type { ContextVariables } from "@/api/types";
import { db } from "@/db";
import { resend } from "@/services/resend";
import { stripe } from "@/services/stripe";
import { prometheus } from "@hono/prometheus";
import { sentry } from "@hono/sentry";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const contextVariables: Omit<ContextVariables, "session"> = {
  db,
  resend,
  stripe,
};
const { printMetrics, registerMetrics } = prometheus();

export const api = new Hono<{ Variables: ContextVariables }>()
  .basePath("/api")
  .onError((err, c) => {
    console.error(err);
    return c.json({ error: err.message }, 500);
  })
  .use(async (ctx, next) => {
    Object.entries(contextVariables).forEach(([key, value]) => {
      ctx.set(key as keyof ContextVariables, value);
    });
    return next();
  })
  .use(logger())
  .use(
    "*",
    sentry({
      enabled: process.env.NODE_ENV === "production",
      dsn: apiConfig.sentryDsn,
      tracesSampleRate: 1.0,
    })
  )
  .use("*", registerMetrics)
  .get("/metrics", printMetrics)
  .use(
    "/auth/*",
    cors({
      origin: "http://localhost:3000",
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  )
  .route("/auth", authRouter)
  .route("/hero", heroRouter)
  .use(authMiddleware)
  .route("/chat", chatRouter)
  .route("/cart", cartRouter)
  .route("/checkout", checkoutRouter)
  .route("/send", sendRouter)
  .route("/subscriptions", subscriptionsRouter)
  .route("/orders", ordersRouter);

export type ApiRouter = typeof api;
