import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ReportPage } from './ReportPage';

vi.mock('framer-motion', () => ({
  motion: { div: ({ children }: { children: React.ReactNode }) => children },
}));

// Mock getChildrenSummary at the module level
vi.mock('../lib/supabase/children', () => ({
  getChildrenSummary: vi.fn(() => Promise.resolve([])),
}));

describe('ReportPage', () => {
  it('renders loading state initially', () => {
    render(<ReportPage
      children={[]}
      selectedChildId={null}
      onSelectChild={vi.fn()}
      onBack={vi.fn()}
    />);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('renders header when children exist', async () => {
    render(<ReportPage
      children={[{ id: '1', name: '小明', avatar_emoji: '👦' }]}
      selectedChildId="1"
      onSelectChild={vi.fn()}
      onBack={vi.fn()}
    />);
    await vi.waitFor(() => {
      expect(screen.getByText(/家长报告/)).toBeInTheDocument();
    });
  });

  it('shows empty message when no children after load', async () => {
    render(<ReportPage
      children={[]}
      selectedChildId={null}
      onSelectChild={vi.fn()}
      onBack={vi.fn()}
    />);
    await vi.waitFor(() => {
      expect(screen.getByText('请先在「我的」中添加孩子')).toBeInTheDocument();
    });
  });
});
