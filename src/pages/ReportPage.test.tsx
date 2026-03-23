import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ReportPage } from './ReportPage';

vi.mock('framer-motion', () => ({
  motion: { div: ({ children }: { children: React.ReactNode }) => children },
}));

describe('ReportPage', () => {
  it('renders loading state initially', () => {
    render(<ReportPage children={[]} selectedChildId={null} onSelectChild={vi.fn()} />);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('renders header when children exist', async () => {
    render(<ReportPage
      children={[
        { id: '1', name: '小明', avatar_emoji: '👦' },
      ]}
      selectedChildId="1"
      onSelectChild={vi.fn()}
    />);
    await vi.waitFor(() => {
      expect(screen.getByText(/家长报告/)).toBeInTheDocument();
    });
  });
});
