import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

interface CookieToSet {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

export async function middleware(request: NextRequest) {
  // 1. Run intl middleware first to handle routing
  const response = intlMiddleware(request as NextRequest);

  // 2. Setup Supabase to check/refresh session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Set cookies on the response object from next-intl
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Refresh session
  // This will trigger the cookie setting if the session is refreshed/updated
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vi|en)/:path*']
};
