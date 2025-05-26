import { redisClient } from "@/lib/redis";

export interface ICacheService {
  get<T>(tableName: string, id: string | number): Promise<T | null>;
  set<T>(
    tableName: string,
    id: string | number,
    data: T,
    ttl?: number
  ): Promise<void>;
  delete(tableName: string, id: string | number): Promise<void>;
  deletePattern(pattern: string): Promise<void>;
  invalidateTable(tableName: string): Promise<void>;
}

export class CacheService implements ICacheService {
  private generateKey(tableName: string, id: string | number): string {
    return `${tableName}:${id}`;
  }

  async get<T>(tableName: string, id: string | number): Promise<T | null> {
    try {
      const key = this.generateKey(tableName, id);
      const cached = await redisClient.get(key);

      if (!cached) {
        return null;
      }

      return JSON.parse(cached) as T;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  async set<T>(
    tableName: string,
    id: string | number,
    data: T,
    ttl = 3600
  ): Promise<void> {
    try {
      const key = this.generateKey(tableName, id);
      const serialized = JSON.stringify(data);

      await redisClient.setEx(key, ttl, serialized);
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  async delete(tableName: string, id: string | number): Promise<void> {
    try {
      const key = this.generateKey(tableName, id);
      await redisClient.del(key);
    } catch (error) {
      console.error("Cache delete error:", error);
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error("Cache deletePattern error:", error);
    }
  }

  async invalidateTable(tableName: string): Promise<void> {
    await this.deletePattern(`${tableName}:*`);
  }
}
