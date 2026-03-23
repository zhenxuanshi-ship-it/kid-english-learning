import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfilePage } from './ProfilePage';
import type { LearningStats } from '../lib/stats';
import type { LearningStage } from '../features/progress/types';

const mockStats: LearningStats = {
  totalWords: 10,
  learnedWords: 5,
  masteredWords: 3,
  wrongWords: 2,
  accuracyRate: 71,
  stageCounts: { new: 2, learning: 5, practicing: 0, review: 0, mastered: 3 } as Record<LearningStage, number>,
  categoryBreakdown: [],
};

vi.mock('framer-motion', () => ({
  motion: { div: ({ children }: { children: React.ReactNode }) => children },
}));

vi.mock('../components/common/ChildSelector', () => ({
  ChildSelector: () => null,
  AddChildModal: ({ onConfirm, onCancel }: { onConfirm: (name: string, emoji: string) => void; onCancel: () => void }) => (
    <div data-testid="add-child-modal">
      <button data-testid="modal-confirm" onClick={() => onConfirm('小明', '👦')}>添加</button>
      <button data-testid="modal-cancel" onClick={onCancel}>取消</button>
    </div>
  ),
}));

vi.mock('../components/common/StatsPanel', () => ({
  StatsPanel: () => null,
}));

vi.mock('../components/common/SettingsPanel', () => ({
  SettingsPanel: () => null,
}));

describe('ProfilePage', () => {
  const defaultProps = {
    stats: mockStats,
    roundSize: 5,
    selectedCategory: 'all',
    categories: ['all', 'animals', 'food'],
    autoPlaySound: false,
    soundEnabled: false,
    storageDiagnostics: { localStorageAvailable: true, persistenceSupported: true, persistenceGranted: true },
    children: [] as Array<{ id: string; name: string; avatar_emoji: string | null }>,
    selectedChildId: null as string | null,
    onSelectChild: vi.fn(),
    onAddChild: vi.fn().mockResolvedValue(undefined),
    onRoundSizeChange: vi.fn(),
    onCategoryChange: vi.fn(),
    onToggleAutoPlaySound: vi.fn(),
    onToggleSoundEnabled: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders version info', () => {
    render(<ProfilePage {...defaultProps} />);
    expect(screen.getByText(/版本信息/)).toBeInTheDocument();
  });

  it('shows empty children hint when no children', () => {
    render(<ProfilePage {...defaultProps} />);
    expect(screen.getByText('还没有添加孩子，点击上方按钮添加')).toBeInTheDocument();
  });

  it('shows "+ 添加孩子" button', () => {
    render(<ProfilePage {...defaultProps} />);
    expect(screen.getByRole('button', { name: '+ 添加孩子' })).toBeInTheDocument();
  });

  it('opens AddChildModal when "+ 添加孩子" is clicked', () => {
    render(<ProfilePage {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '+ 添加孩子' }));
    expect(screen.getByTestId('add-child-modal')).toBeInTheDocument();
  });

  it('closes AddChildModal on cancel', () => {
    render(<ProfilePage {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '+ 添加孩子' }));
    expect(screen.getByTestId('add-child-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('modal-cancel'));
    expect(screen.queryByTestId('add-child-modal')).not.toBeInTheDocument();
  });

  it('calls onAddChild on confirm', async () => {
    render(<ProfilePage {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '+ 添加孩子' }));
    fireEvent.click(screen.getByTestId('modal-confirm'));

    await vi.waitFor(() => {
      expect(defaultProps.onAddChild).toHaveBeenCalledWith('小明', '👦');
    });
  });

  it('shows current child badge when child selected', () => {
    render(<ProfilePage {...defaultProps} children={[
      { id: '1', name: '小明', avatar_emoji: '👦' },
    ]} selectedChildId="1" />);

    expect(screen.getByText(/当前学习账号/)).toBeInTheDocument();
    expect(screen.getByText('👦 小明')).toBeInTheDocument();
  });

  it('renders header section', () => {
    render(<ProfilePage {...defaultProps} />);
    expect(screen.getByText(/学习账号/)).toBeInTheDocument();
    expect(screen.getByText(/版本信息/)).toBeInTheDocument();
  });
});
