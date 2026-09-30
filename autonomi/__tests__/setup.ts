import '@testing-library/jest-dom';
import { vi, expect } from 'vitest';
import React from 'react';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => {
    return React.createElement('a', { href, ...props }, children);
  }
}));

vi.mock('next/font/local', () => ({
  default: () => ({
    className: 'mocked-local-font',
    variable: '--font-local',
    style: { fontFamily: 'mocked-font' },
  }),
}));

vi.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mocked-inter-font',
    variable: '--font-sans',
    style: { fontFamily: 'Inter' },
  }),
}));
