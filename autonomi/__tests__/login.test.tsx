import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from '@/app/(auth)/login/page';
import { apiClient } from '@/lib/api-client';
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

describe('LoginPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.clearAllMocks();
  });

  const renderPage = () => render(
    <QueryClientProvider client={queryClient}>
      <LoginPage />
    </QueryClientProvider>
  );

  it('renders with correct initial state', () => {
    renderPage();
    
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/Password/i)).toHaveValue('');
    
    const submitBtn = screen.getByRole('button', { name: /Log in/i });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  it('valid input calls the correct handler with the correctly-shaped payload', async () => {
    const user = userEvent.setup();
    (apiClient.post as any).mockResolvedValueOnce({
      data: {
        access_token: 'fake_token',
        expires_in: 3600,
        user: { id: '1' }
      }
    });

    renderPage();

    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Log in/i }));

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('server-side validation errors are displayed to the user', async () => {
    const user = userEvent.setup();
    (apiClient.post as any).mockRejectedValueOnce({
      response: { data: { detail: 'Invalid credentials' } }
    });

    renderPage();

    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('submit button shows loading state and is disabled during submission', async () => {
    const user = userEvent.setup();
    
    let resolvePost: any;
    (apiClient.post as any).mockImplementation(() => new Promise((resolve) => {
      resolvePost = resolve;
    }));

    renderPage();

    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123');
    
    await user.click(screen.getByRole('button', { name: /Log in/i }));

    const btn = screen.getByRole('button', { name: /Logging in.../i });
    expect(btn).toBeDisabled();

    resolvePost({
      data: { access_token: 'fake', expires_in: 1, user: {} }
    });

    await waitFor(() => {
      // should navigate away, or btn returns to normal state if error
    });
  });
});
