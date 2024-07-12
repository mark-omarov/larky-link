import { cookies, headers } from 'next/headers';
import { sessionConfig } from '@/config';

export function getSessionKey(): string | undefined {
  let sessionKey = cookies().get(sessionConfig.cookie.name)?.value;
  if (!sessionKey) {
    sessionKey = headers()
      .get('set-cookie')
      ?.split(';')
      ?.find((c) => c.startsWith(sessionConfig.cookie.name))
      ?.split('=')?.[1];
  }
  return sessionKey;
}
