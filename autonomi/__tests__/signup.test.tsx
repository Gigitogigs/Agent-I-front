import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignupPage from '@/app/(auth)/signup/page';
import { apiClient } from '@/lib/api-client';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/lib/api-client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe('SignupPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.clearAllMocks();
  });

  const renderPage = () => render(
    <QueryClientProvider client={queryClient}>
      <SignupPage />
    </QueryClientProvider>
  );

  it('renders with correct initial state', () => {
    renderPage();
    expect(screen.getByLabelText(/Full name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/Password/i)).toHaveValue('');
  });

  it('valid input calls the correct handler with the correctly-shaped payload', async () => {
    const user = userEvent.setup();
    (apiClient.post as any).mockResolvedValueOnce({ data: {} });

    renderPage();

    await user.type(screen.getByLabelText(/Full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/Email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123'); // 11 chars
    await user.click(screen.getByRole('button', { name: /Create account/i }));

    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
      full_name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });
  });

  it('validation rule: rejects password under 8 characters', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/Full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/Email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'short'); // 5 chars
    
    // trigger blur
    await user.tab();

    expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Create account/i }));
    
    // should not call api
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('validation rule: accepts password exactly at boundary valid length (8 chars)', async () => {
    const user = userEvent.setup();
    (apiClient.post as any).mockResolvedValueOnce({ data: {} });

    renderPage();

    await user.type(screen.getByLabelText(/Full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/Email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'eightchr'); // 8 chars
    
    await user.click(screen.getByRole('button', { name: /Create account/i }));

    expect(screen.queryByText('Password must be at least 8 characters.')).not.toBeInTheDocument();
    expect(apiClient.post).toHaveBeenCalled();
  });

  it('server-side validation errors are displayed to the user', async () => {
    const user = userEvent.setup();
    (apiClient.post as any).mockRejectedValueOnce({
      response: { data: { detail: [{ msg: 'Email already exists' }] } }
    });

    renderPage();

    await user.type(screen.getByLabelText(/Full name/i), 'Jane');
    await user.type(screen.getByLabelText(/Email/i), 'taken@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });
});
