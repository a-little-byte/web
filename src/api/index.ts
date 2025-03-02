import { apiConfig } from "@/api/config";
import { db } from "@/db";
import { Hono } from "hono";
import { Resend } from "resend";
import Stripe from "stripe";
import { authMiddleware } from "./middlewares";
import {
  authRouter,
  cartRouter,
  chatRouter,
  checkoutRouter,
  sendRouter,
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
  .route("/auth", authRouter)
  .use(authMiddleware)
  .route("/chat", chatRouter)
  .route("/cart", cartRouter)
  .route("/checkout", checkoutRouter)
  .route("/send", sendRouter);

export type ApiRouter = typeof api;
