import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import KnowledgeBasePage from '@/app/(dashboard)/knowledge-base/page';
import { apiClient } from '@/lib/api-client';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
  },
  axiosInstance: {
    post: vi.fn(),
  }
}));

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ activeWorkspaceId: 'wk-1' })
}));

const mockDoc = {
  id: 'doc-1',
  filename: 'guide.pdf',
  status: 'READY',
  tags: { dept: 'sales' },
  file_size_bytes: 1024,
  chunk_count: 5,
  created_at: new Date().toISOString(),
  error_message: null
};

describe('KnowledgeBasePage Data Fetching & Mutations', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.clearAllMocks();
  });

  const renderPage = () => render(
    <QueryClientProvider client={queryClient}>
      <KnowledgeBasePage />
    </QueryClientProvider>
  );

  it('renders loading state while request is in flight', async () => {
    let resolveGet: any;
    (apiClient.get as any).mockImplementation(() => new Promise((resolve) => {
      resolveGet = resolve;
    }));

    renderPage();
    
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    
    resolveGet([]);
    await waitFor(() => {
      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
    });
  });

  it('renders success data correctly', async () => {
    (apiClient.get as any).mockResolvedValueOnce([mockDoc]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('guide.pdf')).toBeInTheDocument();
      // formatBytes(1024) -> "1 KB"
      expect(screen.getByText('1 KB')).toBeInTheDocument();
    });
  });

  it('renders empty list gracefully', async () => {
    (apiClient.get as any).mockResolvedValueOnce([]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('No documents yet')).toBeInTheDocument();
    });
  });

  it('renders clear error state on network failure', async () => {
    (apiClient.get as any).mockRejectedValueOnce(new Error('Network Error'));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Failed to load knowledge base documents.')).toBeInTheDocument();
    });
  });

  it('mutation success: delete KB file sends payload and invalidates query', async () => {
    const user = userEvent.setup();
    (apiClient.get as any).mockResolvedValueOnce([mockDoc]);
    (apiClient.delete as any).mockResolvedValueOnce({ data: {} });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('guide.pdf')).toBeInTheDocument();
    });

    // The delete button is usually an icon or "Delete", we will query by closest role or assuming there's a button
    // Let's assume the DocumentRow has a button with title/aria-label or we just find the button
    // We will just find all buttons and click the one that triggers delete
    const deleteBtn = screen.getByRole('button', { name: /Delete/i }); 
    // Wait, the button in document-row might not have name "Delete", it might just be a trash icon.
    // If we can't find it easily by name, we'll fire click on the button that has a specific class or icon.
    // Since we don't have the DocumentRow code handy, let's assume it has a title "Delete" or we can mock it.
    // If it fails, we will see in vitest output.
    await user.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(apiClient.delete).toHaveBeenCalledWith('/workspaces/wk-1/knowledge-base/doc-1');
    
    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['workspaces', 'wk-1', 'knowledge'] });
    });
    
    confirmSpy.mockRestore();
  });
});
