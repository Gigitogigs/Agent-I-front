import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from '@/app/(auth)/login/page';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/use-auth';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/lib/api-client', () => ({
  apiClient: {
    post: vi.fn(),
  },
  axiosInstance: {
    defaults: { headers: { common: {} } },
  },
}));

vi.mock('@/lib/token-store', () => ({
  tokenStore: {
    set: vi.fn(),
  },
}));

// We need a helper to test the `useAuth` hook behavior after login
const TestAuthContext = () => {
  const { activeWorkspaceId } = useAuth();
  return <div data-testid="workspace-id">{activeWorkspaceId || 'no-workspace'}</div>;
};

describe('LoginPage Auth Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.clearAllMocks();
  });

  const renderPageWithAuthContext = () => render(
    <QueryClientProvider client={queryClient}>
      <LoginPage />
      <TestAuthContext />
    </QueryClientProvider>
  );

  it('regression: login does not seed partial user (without memberships) into auth cache', async () => {
    // Regression for: login mutation was calling queryClient.setQueryData(['auth', 'me'], data.user)
    // where data.user lacked the `memberships` array. This caused useAuth to never set
    // activeWorkspaceId, permanently disabling all workspace-scoped queries.
    //
    // Fixed by: replacing setQueryData with invalidateQueries so useAuth refetches
    // /auth/me (which returns the full UserOut including memberships).
    const user = userEvent.setup();
    const loginPayload = {
      access_token: 'fake_token',
      expires_in: 3600,
      user: {
        id: '1',
        name: 'Test',
        email: 'test@example.com'
        // memberships intentionally absent — same shape the backend login endpoint returns
      }
    };
    (apiClient.post as any).mockResolvedValueOnce(loginPayload);

    renderPageWithAuthContext();

    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });

    // The fix: the cache must NOT be seeded with the partial user object from the login response.
    // Instead, invalidateQueries was called, leaving cache undefined until /auth/me refetches.
    const cachedUser = queryClient.getQueryData(['auth', 'me']);
    expect(cachedUser).toBeUndefined();
  });
});
