import { env } from '@/env.mjs';

export const redisConfig = {
  url: env.REDIS_URL,
  default: {
    ex: 60 * 60 * 24 * 7, // 1 week
  },
};
