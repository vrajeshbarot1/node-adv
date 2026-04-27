import { createClient } from 'redis';
import logger from './logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = createClient({ url: redisUrl });

client.on('error', (err) => logger.error('Redis Client Error', err));

export const connectRedis = async () => {
  try {
    await client.connect();
    logger.info('Connected to Redis in Task Service');
  } catch (error) {
    logger.error('Failed to connect to Redis', error);
  }
};

export const getCache = async (key: string) => {
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
};

export const setCache = async (key: string, value: any, ttlSeconds = 3600) => {
  try {
    await client.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (error) {
    logger.error(`Error setting cache for key ${key}:`, error);
  }
};

export const deleteCache = async (key: string) => {
  try {
    await client.del(key);
  } catch (error) {
    logger.error(`Error deleting cache for key ${key}:`, error);
  }
};

export default client;
