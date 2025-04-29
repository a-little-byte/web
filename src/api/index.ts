import { apiConfig } from "@/api/config";
import { authMiddleware } from "@/api/middlewares/auth";
import {
  accountRoute,
  authRouter,
  checkoutRouter,
  heroRouter,
  ordersRouter,
  paymentsRouter,
  productsRouter,
  sendRouter,
  servicesRouter,
  subscriptionsRouter,
} from "@/api/routes";
import { enforcer } from "@/api/services/casbin";
import { resend } from "@/api/services/resend";
import { stripe } from "@/api/services/stripe";
import type { PrivateContextVariables } from "@/api/types";
import { db } from "@/db";
import { HTTP_CODES, PublicError } from "@/errors";
import { prometheus } from "@hono/prometheus";
import { sentry } from "@hono/sentry";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

const contextVariables: Omit<PrivateContextVariables, "session"> = {
  db,
  resend,
  stripe,
  enforcer,
};
const { printMetrics, registerMetrics } = prometheus();

export const api = new Hono<{ Variables: PrivateContextVariables }>()
  .basePath("/api")
  .onError((err, c) => {
    if (err instanceof PublicError) {
      return c.json({ error: err.message }, err.status);
    }

    console.error(err);
    return c.json(
      { error: "Internal server error" },
      HTTP_CODES.INTERNAL_SERVER_ERROR
    );
  })
  .use(async (ctx, next) => {
    Object.entries(contextVariables).forEach(([key, value]) => {
      ctx.set(key as keyof PrivateContextVariables, value);
    });
    await next();
  })
  .use(logger(), prettyJSON())
  .use(
    "*",
    sentry({
      enabled: process.env.NEXT_PUBLIC_NODE_ENV === "production",
      dsn: apiConfig.sentryDsn,
      tracesSampleRate: 1.0,
    })
  )
  .use("*", registerMetrics)
  .get("/metrics", printMetrics)
  .use("*", csrf({ origin: "http:localhost:3000" }))
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
  .route("/services", servicesRouter)
  .route("/products", productsRouter)
  .use(authMiddleware)
  .route("/account", accountRoute)
  // .route("/chat", chatRouter)
  .route("/checkout", checkoutRouter)
  .route("/contact", sendRouter)
  .route("/subscriptions", subscriptionsRouter)
  .route("/orders", ordersRouter)
  .route("/payments", paymentsRouter);

export type ApiRouter = typeof api;
