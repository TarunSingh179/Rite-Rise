import { createClient } from 'redis';

/**
 * Redis client configuration for Upstash
 * Used for real-time features: messaging, notifications, presence
 */

const redis = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_TOKEN,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error('Max Redis retries reached');
      }
      return retries * 50;
    },
  },
});

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('Redis Client Connected'));

export default redis;
