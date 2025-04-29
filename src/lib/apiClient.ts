import type { ApiRouter } from "@/api";
import { hc } from "hono/client";

export const apiClient = hc<ApiRouter>("http://localhost:3000").api;
