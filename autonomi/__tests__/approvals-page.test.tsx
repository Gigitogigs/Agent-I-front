import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ApprovalsPage from '@/app/(dashboard)/approvals/page';
import { apiClient, axiosInstance } from '@/lib/api-client';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
  axiosInstance: {
    post: vi.fn(),
  }
}));

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ activeWorkspaceId: 'wk-1' })
}));

const mockApproval = {
  id: 'app-1',
  status: 'PENDING',
  risk_level: 'HIGH',
  action_type: 'Refund',
  agent_id: 'Agent Smith',
  conversation_id: 'conv-1',
  expires_at: new Date(Date.now() + 100000).toISOString(),
  created_at: new Date().toISOString(),
  payload: { amount: 100 }
};

describe('ApprovalsPage Data Fetching & Mutations', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.clearAllMocks();
  });

  const renderPage = () => render(
    <QueryClientProvider client={queryClient}>
      <ApprovalsPage />
    </QueryClientProvider>
  );

  it('renders loading state while request is in flight', async () => {
    let resolveGet: any;
    (apiClient.get as any).mockImplementation(() => new Promise((resolve) => {
      resolveGet = resolve;
    }));

    renderPage();
    
    // Using simple selector for spinner
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    
    resolveGet([]);
    await waitFor(() => {
      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
    });
  });

  it('renders empty list correctly', async () => {
    (apiClient.get as any).mockResolvedValueOnce([]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('No pending approvals')).toBeInTheDocument();
    });
  });

  it('renders a single item and selects it by default', async () => {
    (apiClient.get as any).mockResolvedValueOnce([mockApproval]);
    renderPage();

    await waitFor(() => {
      // Row is rendered
      expect(screen.getAllByText('Refund').length).toBeGreaterThan(0);
      // Detail panel is rendered (default selected)
      expect(screen.getByText('Requested by:')).toBeInTheDocument();
      expect(screen.getAllByText('Agent Smith').length).toBeGreaterThan(0);
    });
  });

  it('renders clear error state on 500/network failure', async () => {
    (apiClient.get as any).mockRejectedValueOnce(new Error('Network Error'));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Failed to load approvals.')).toBeInTheDocument();
    });
  });

  it('mutation success: correct payload, UI updates, query invalidated', async () => {
    const user = userEvent.setup();
    (apiClient.get as any).mockResolvedValueOnce([mockApproval]);
    (axiosInstance.post as any).mockResolvedValueOnce({ data: {} });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Approve')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Approve'));

    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/workspaces/wk-1/approvals/app-1/approve',
      {},
      expect.objectContaining({ headers: { 'Idempotency-Key': 'app-1:approve' } })
    );

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['workspaces', 'wk-1', 'approvals'] });
    });
  });

  it('mutation race condition: firing mutation twice rapidly only triggers once', async () => {
    const user = userEvent.setup();
    (apiClient.get as any).mockResolvedValueOnce([mockApproval]);
    
    // slow mutation
    (axiosInstance.post as any).mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 100)));
    
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Approve')).toBeInTheDocument();
    });

    const approveBtn = screen.getByText('Approve');
    
    // fire double click rapidly
    fireEvent.click(approveBtn);
    fireEvent.click(approveBtn);

    // Should only be called once because the button gets disabled on first click
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledTimes(1);
      expect(approveBtn).toBeDisabled();
    });
  });

  it('mutation race with server state: handles conflicts gracefully', async () => {
    const user = userEvent.setup();
    (apiClient.get as any).mockResolvedValueOnce([mockApproval]);
    (axiosInstance.post as any).mockRejectedValueOnce({
      response: { status: 409, data: { detail: 'Approval already resolved' } }
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Reject')).toBeInTheDocument();
    });

    // open reject flow
    await user.click(screen.getByText('Reject'));
    await user.type(screen.getByPlaceholderText(/Explain why/i), 'Too expensive');
    await user.click(screen.getByText('Confirm rejection'));

    await waitFor(() => {
      expect(screen.getByText('Rejection failed. The approval may have already been resolved — please refresh the queue.')).toBeInTheDocument();
    });
  });
});
