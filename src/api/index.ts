import { Hono } from "hono";
import { auth } from "./auth";
import { chat } from "./chat";
import { checkout } from "./checkout";
import { send } from "./send";

export const api = new Hono()
  .basePath("/api")
  .route("/auth", auth)
  .route("/chat", chat)
  .route("/checkout", checkout)
  .route("/send", send);

export type ApiRouter = typeof api;
