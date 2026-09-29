import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/shared/status-badge';
import { describe, it, expect } from 'vitest';

describe('StatusBadge', () => {
  it('renders correctly with default label for variant', () => {
    render(<StatusBadge variant="APPROVED" />);
    const badge = screen.getByText('APPROVED');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100'); // Check variant class mapping
  });

  it('renders correctly with a custom label', () => {
    render(<StatusBadge variant="HIGH" label="Critical Issue" />);
    expect(screen.getByText('Critical Issue')).toBeInTheDocument();
    expect(screen.queryByText('HIGH')).not.toBeInTheDocument();
  });

  it('renders correctly for a realistic range of props (risk levels)', () => {
    const { rerender } = render(<StatusBadge variant="LOW" />);
    expect(screen.getByText('LOW')).toHaveClass('text-green-700');

    rerender(<StatusBadge variant="MED" />);
    expect(screen.getByText('MED')).toHaveClass('text-amber-700');

    rerender(<StatusBadge variant="HIGH" />);
    expect(screen.getByText('HIGH')).toHaveClass('text-red-700');
  });

  it('handles unknown variants gracefully (if TypeScript is bypassed)', () => {
    // @ts-ignore
    render(<StatusBadge variant="UNKNOWN" />);
    const badge = screen.getByText('UNKNOWN');
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-600');
  });
});
