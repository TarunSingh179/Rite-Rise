import { Redis } from '@upstash/redis';
import { validateEnv } from './env';

/**
 * Redis client configuration for Upstash
 * Uses REST-based client compatible with Vercel serverless
 * Used for caching and real-time features
 */

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️  Upstash Redis not configured. Caching features disabled.');
    }
    return null;
  }

  try {
    // Only validate if we are actually trying to use it
    if (process.env.NODE_ENV !== 'test') {
      validateEnv();
    }
    redis = new Redis({ url, token });
    return redis;
  } catch (err) {
    console.error('Failed to initialize Redis client:', err);
    return null;
  }
}

export default getRedis;
