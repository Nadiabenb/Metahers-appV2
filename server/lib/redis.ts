
import Redis from 'ioredis';
import { logger } from './logger';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  // Return existing client if already connected
  if (redisClient) {
    return redisClient;
  }

  // Check if Redis URL is configured
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    logger.warn('REDIS_URL not configured - Redis caching disabled');
    return null;
  }

  try {
    // Create new Redis client (Upstash compatible)
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    // Connection event handlers
    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready');
    });

    redisClient.on('error', (err) => {
      logger.error({ error: err.message }, 'Redis client error');
    });

    redisClient.on('close', () => {
      logger.warn('Redis connection closed');
    });

    // Connect to Redis
    redisClient.connect().catch((err) => {
      logger.error({ error: err.message }, 'Failed to connect to Redis');
      redisClient = null;
    });

    return redisClient;
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Failed to create Redis client');
    redisClient = null;
    return null;
  }
}

// Health check function
export async function checkRedisHealth(): Promise<boolean> {
  const client = getRedisClient();
  if (!client) {
    return false;
  }

  try {
    const result = await client.ping();
    return result === 'PONG';
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Redis health check failed');
    return false;
  }
}

// Graceful shutdown
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.quit();
      logger.info('Redis connection closed gracefully');
    } catch (error) {
      logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Error closing Redis connection');
    }
    redisClient = null;
  }
}
