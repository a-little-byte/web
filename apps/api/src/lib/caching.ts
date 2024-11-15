import { apiConfig } from "@alittlebyte/api/config"
import { createClient } from "redis"

export const redis = await (async () => {
	const client = createClient({
		url: `redis://${apiConfig.cache.hostname}:${apiConfig.cache.port}/0`,
	})

	await client.connect()

	return client
})()
