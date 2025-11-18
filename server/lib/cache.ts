
import crypto from 'crypto';
import { getRedisClient } from './redis';
import { logger } from './logger';

// Cache statistics
let cacheStats = {
  hits: 0,
  misses: 0,
  sets: 0,
  deletes: 0,
};

export function getCacheStats() {
  const total = cacheStats.hits + cacheStats.misses;
  const hitRate = total > 0 ? ((cacheStats.hits / total) * 100).toFixed(2) : '0.00';
  
  return {
    ...cacheStats,
    hitRate: `${hitRate}%`,
    total,
  };
}

export function resetCacheStats() {
  cacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
  };
}

// Get value from cache
export async function cacheGet<T = any>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis) {
    return null;
  }

  try {
    const value = await redis.get(key);
    if (value) {
      cacheStats.hits++;
      return JSON.parse(value);
    }
    cacheStats.misses++;
    return null;
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error), key }, 'Cache get failed');
    cacheStats.misses++;
    return null;
  }
}

// Set value in cache with TTL
export async function cacheSet(key: string, value: any, ttlSeconds: number): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    await redis.setex(key, ttlSeconds, serialized);
    cacheStats.sets++;
    return true;
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error), key }, 'Cache set failed');
    return false;
  }
}

// Delete single key
export async function cacheDel(key: string): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) {
    return false;
  }

  try {
    await redis.del(key);
    cacheStats.deletes++;
    return true;
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error), key }, 'Cache delete failed');
    return false;
  }
}

// Delete keys matching pattern
export async function cacheDelPattern(pattern: string): Promise<number> {
  const redis = getRedisClient();
  if (!redis) {
    return 0;
  }

  try {
    const keys = await redis.keys(pattern);
    if (keys.length === 0) {
      return 0;
    }
    
    await redis.del(...keys);
    cacheStats.deletes += keys.length;
    return keys.length;
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error), pattern }, 'Cache delete pattern failed');
    return 0;
  }
}

// Hash input for cache key generation
export function hashInput(input: string): string {
  return crypto
    .createHash('sha256')
    .update(input)
    .digest('hex')
    .substring(0, 16);
}

// Get cache memory usage
export async function getCacheMemoryUsage(): Promise<{ used: string; maxMemory: string } | null> {
  const redis = getRedisClient();
  if (!redis) {
    return null;
  }

  try {
    const info = await redis.info('memory');
    const usedMatch = info.match(/used_memory_human:(.+)/);
    const maxMatch = info.match(/maxmemory_human:(.+)/);
    
    return {
      used: usedMatch ? usedMatch[1].trim() : 'Unknown',
      maxMemory: maxMatch ? maxMatch[1].trim() : 'Unknown',
    };
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Failed to get cache memory usage');
    return null;
  }
}
