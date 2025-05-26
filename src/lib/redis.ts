import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

if (!redisClient.isOpen) {
  redisClient.connect().catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });
}

export { redisClient };
