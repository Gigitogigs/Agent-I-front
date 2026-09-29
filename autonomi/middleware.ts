import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REFRESH_COOKIE = 'refresh_token'; // Verified from backend codebase

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshCookie = request.cookies.has(REFRESH_COOKIE);

  // If trying to access a protected route without a session → redirect to /login
  const isProtected = pathname.startsWith('/') && !pathname.startsWith('/login') && !pathname.startsWith('/_next') && !pathname.startsWith('/api');
  
  if (isProtected && !hasRefreshCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname); // preserve destination
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to visit /login → redirect to home
  if (pathname.startsWith('/login') && hasRefreshCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
