import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '@/components/shared/empty-state';
import { describe, it, expect, vi } from 'vitest';
import { Search } from 'lucide-react';

describe('EmptyState', () => {
  it('renders with title and description', () => {
    render(<EmptyState title="No items found" description="Try adjusting your filters" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
  });

  it('renders with a custom icon', () => {
    render(
      <EmptyState 
        icon={Search} 
        title="No results" 
        description="We couldn't find anything."
      />
    );
    // Lucide icons render an svg, we can check if it's there
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders action button if action prop is provided and fires callback on click', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();
    
    render(
      <EmptyState 
        title="No data" 
        description="Please add some data." 
        action={{ label: 'Create New', onClick: handleAction }}
      />
    );
    
    const button = screen.getByRole('button', { name: 'Create New' });
    expect(button).toBeInTheDocument();
    
    await user.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('does not render action button if action prop is missing', () => {
    render(<EmptyState title="No data" description="Please add some data." />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
