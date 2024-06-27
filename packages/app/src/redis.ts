import { createClient } from 'redis';
import { redisConfig } from '@/config';

export const createRedis = async () =>
  await createClient({ url: redisConfig.url })
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect();
