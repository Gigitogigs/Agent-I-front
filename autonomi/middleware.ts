import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REFRESH_COOKIE = 'refresh_token'; // Verified from backend codebase

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshCookie = request.cookies.has(REFRESH_COOKIE);

  const publicPaths = ['/login', '/signup'];
  const isPublicPath = publicPaths.some(p => pathname.startsWith(p));

  // If trying to access a protected route without a session → redirect to /login
  const isProtected = pathname.startsWith('/') && !isPublicPath && !pathname.startsWith('/_next') && !pathname.startsWith('/api');
  
  if (isProtected && !hasRefreshCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname); // preserve destination
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to visit an auth page → redirect to home
  if (isPublicPath && hasRefreshCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
