import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ulid } from 'ulidx';
import { z } from 'zod';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (
    !request.cookies.has('_laky-link-ulid') ||
    !z.string().ulid().safeParse(request.cookies.get('_laky-link-ulid')?.value)
      .success
  ) {
    response.cookies.set('_laky-link-ulid', ulid(), { httpOnly: true });
  }

  return response;
}
