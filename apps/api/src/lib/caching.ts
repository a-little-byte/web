import { apiConfig } from "@alittlebyte/api/config"
import { createClient } from "redis"

export const redis = createClient({
	url: `redis://${apiConfig.cache.hostname}:${apiConfig.cache.port}`,
})
