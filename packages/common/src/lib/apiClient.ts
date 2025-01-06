import type { ApiRouter } from "@alittlebyte/api/index"
import { hc } from "hono/client"

export const apiClient = hc<ApiRouter>("http://localhost:3000")
