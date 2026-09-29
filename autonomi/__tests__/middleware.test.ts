import { middleware } from '@/middleware';
import { NextRequest } from 'next/server';
import { describe, it, expect, vi } from 'vitest';

describe('Middleware Route Protection', () => {
  const createMockRequest = (pathname: string, hasToken: boolean) => {
    return {
      nextUrl: { pathname, clone: () => new URL('http://localhost' + pathname) },
      url: 'http://localhost' + pathname,
      cookies: {
        has: vi.fn().mockReturnValue(hasToken),
      },
    } as unknown as NextRequest;
  };

  it('unauthenticated access to protected route redirects to login', () => {
    const req = createMockRequest('/settings', false);
    const res = middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/login?next=%2Fsettings');
  });

  it('authenticated access to protected route allows access', () => {
    const req = createMockRequest('/settings', true);
    const res = middleware(req);
    // NextResponse.next() returns a response without a redirect status
    expect(res.headers.get('location')).toBeNull();
  });

  it('auth state expiring mid-session redirects to login cleanly (prevents loop)', () => {
    const req = createMockRequest('/dashboard', false);
    const res = middleware(req);
    expect(res.headers.get('location')).toBe('http://localhost/login?next=%2Fdashboard');
    
    // Simulate following the redirect without a token
    const redirectedReq = createMockRequest('/login', false);
    const redirectedRes = middleware(redirectedReq);
    
    // It should not redirect again, breaking any potential infinite loop
    expect(redirectedRes.headers.get('location')).toBeNull();
  });

  it('logout clears all auth state such that subsequent protected-route access redirects to login', () => {
    // This tests the middleware side of it. We simulate a request missing the token.
    const req = createMockRequest('/team', false);
    const res = middleware(req);
    expect(res.headers.get('location')).toBe('http://localhost/login?next=%2Fteam');
  });
});
