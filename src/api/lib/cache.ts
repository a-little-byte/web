import { ICacheService } from "@/api/services/cache";
import { UUID } from "node:crypto";

export interface CacheOptions {
  tableName: string;
  ttl?: number;
  keyGenerator?: (id: string | number) => string;
}

/**
 * Helper function to manually cache a database query result
 */
export const cacheQuery = async <T>(
  cacheService: ICacheService,
  tableName: string,
  id: UUID,
  queryFn: (id: UUID) => Promise<T>,
  ttl = 3600
): Promise<T> => {
  const cached = await cacheService.get<T>(tableName, id);
  if (cached) {
    return cached;
  }

  const result = await queryFn(id);

  if (result) {
    await cacheService.set(tableName, id, result, ttl);
  }

  return result;
};
