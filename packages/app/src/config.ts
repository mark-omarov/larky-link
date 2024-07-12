import { env } from '@/env.mjs';

export type RedisConfig = {
  /**
   * Redis connection URL
   * @see {@link https://www.npmjs.com/package/redis#options-object-properties|Redis} Docs
   */
  url: string;
  /**
   * Redis connection options
   */
  options: {
    /**
     * Expiry time in seconds
     * @default 604800 (1 week)
     */
    ex: number;
  };
};

export const redisConfig: RedisConfig = {
  url: env.REDIS_URL,
  options: {
    ex: 60 * 60 * 24 * 7, // 1 week
  },
};

export type SessionConfig = {
  /**
   * Session cookie configuration
   */
  cookie: {
    /**
     * Cookie name
     * @default '_ll-ulid'
     */
    name: string;
    /**
     * Cookie options
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#attributes|MDN Web Docs}
     */
    options: {
      /**
       * HTTP only flag
       * @default true
       */
      httpOnly: boolean;
      /**
       * SameSite flag
       * @default true
       */
      sameSite: boolean;
      /**
       * Max age in seconds
       * @default 7776000 (3 months)
       */
      maxAge: number;
    };
  };
};

export const sessionConfig: SessionConfig = {
  cookie: {
    name: '_ll-ulid',
    options: {
      httpOnly: true,
      sameSite: true,
      maxAge: 60 * 60 * 24 * 30 * 3, // 3 months
    },
  },
};

export type PaginationConfig = {
  /**
   * Limit of items per page
   */
  limit: {
    /**
     * Default value
     * @default 10
     */
    defaultValue: number;
    /**
     * Minimum value
     * @default 10
     */
    minValue: number;
    /**
     * Maximum value
     * @default 50
     */
    maxValue: number;
  };
  /**
   * Page number
   */
  page: {
    /**
     * Default value
     * @default 1
     */
    defaultValue: number;
    /**
     * Minimum value
     * @default 1
     */
    minValue: number;
  };
};

export const paginationConfig: PaginationConfig = {
  limit: {
    defaultValue: 10,
    minValue: 10,
    maxValue: 50,
  },
  page: {
    defaultValue: 1,
    minValue: 1,
  },
};
