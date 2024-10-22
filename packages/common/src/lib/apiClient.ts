import { ApiRouter } from "@alittlebyte/api/index"
import { hc } from "hono/client"

export const apiClient = (endpoint: string) => hc<ApiRouter>(endpoint)
