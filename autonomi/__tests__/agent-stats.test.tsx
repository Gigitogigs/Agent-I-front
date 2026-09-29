import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AgentStatsPage from '@/app/(dashboard)/agent-stats/page';
import { apiClient } from '@/lib/api-client';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  }
}));

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ activeWorkspaceId: 'wk-1' })
}));

const mockStatsData = {
  metrics: [
    { id: 'm1', label: 'Total Calls', value: '1000' }
  ],
  agentStats: [
    { agentName: 'Agent A', calls: 500, avgLatency: '1.2s', fallbackRate: '5%', errorRate: '1%' }
  ]
};

describe('AgentStatsPage Data Fetching', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
  });

  const renderPage = () => render(
    <QueryClientProvider client={queryClient}>
      <AgentStatsPage />
    </QueryClientProvider>
  );

  it('renders loading state while request is in flight', async () => {
    let resolveGet: any;
    (apiClient.get as any).mockImplementation(() => new Promise((resolve) => {
      resolveGet = resolve;
    }));

    renderPage();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    
    resolveGet(mockStatsData);
    await waitFor(() => {
      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
    });
  });

  it('renders success data correctly (metrics and breakdown)', async () => {
    (apiClient.get as any).mockResolvedValueOnce(mockStatsData);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Total Calls')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('Agent A')).toBeInTheDocument();
    });
  });

  it('renders clear error state on 500/network failure, does not crash', async () => {
    (apiClient.get as any).mockRejectedValueOnce(new Error('Network Error'));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Failed to load agent stats.')).toBeInTheDocument();
    });
  });

  it('refetch behavior: changing time range triggers new API call with correct param', async () => {
    const user = userEvent.setup();
    (apiClient.get as any).mockResolvedValue(mockStatsData);
    
    renderPage();

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('timeRange=7d'));
    });

    // click 24h tab
    await user.click(screen.getByRole('button', { name: '24h' }));

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('timeRange=24h'));
    });
  });
});
