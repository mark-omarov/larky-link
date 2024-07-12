import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ulid } from 'ulidx';
import { z } from 'zod';
import { sessionConfig } from '@/config';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (
    !request.cookies.has(sessionConfig.cookie.name) ||
    !z
      .string()
      .ulid()
      .safeParse(request.cookies.get(sessionConfig.cookie.name)?.value).success
  ) {
    response.cookies.set(sessionConfig.cookie.name, ulid(), {
      ...sessionConfig.cookie.options,
      // Besides the maxAge, we also set the expires field to cover all client implementations
      expires: new Date(
        Date.now() + sessionConfig.cookie.options.maxAge * 1000,
      ),
    });
  }

  return response;
}
