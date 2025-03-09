import { apiConfig } from "@/api/config";
import { authMiddleware } from "@/api/middlewares";
import { db } from "@/db";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Resend } from "resend";
import Stripe from "stripe";
import {
  authRouter,
  cartRouter,
  chatRouter,
  checkoutRouter,
  heroRouter,
  ordersRouter,
  sendRouter,
  subscriptionsRouter,
} from "./routes";
import type { ContextVariables } from "./types";

const contextVariables: Omit<ContextVariables, "session"> = {
  db,
  resend: new Resend(apiConfig.resendApiKey),
  stripe: new Stripe(apiConfig.stripeSecretKey, {
    apiVersion: "2023-10-16",
  }),
};

export const api = new Hono<{ Variables: ContextVariables }>()
  .basePath("/api")
  .use(async (ctx, next) => {
    Object.entries(contextVariables).forEach(([key, value]) => {
      ctx.set(key as keyof ContextVariables, value);
    });
    return next();
  })
  .use(
    "/auth/*",
    cors({
      origin: "http://localhost:3001",
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
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
