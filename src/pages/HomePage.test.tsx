import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  const baseProps = {
    mode: 'e2c' as const,
    totalStars: 5,
    roundSize: 5,
    selectedCategory: 'all',
    categories: ['animals', 'fruits'],
    categoryItems: [
      { category: 'animals', label: '动物', total: 15, learned: 6, mastered: 1, progressPercent: 40, featuredWord: 'cat', featuredChinese: '猫' },
      { category: 'fruits', label: '水果', total: 10, learned: 2, mastered: 0, progressPercent: 20, featuredWord: 'apple', featuredChinese: '苹果' },
    ],
    autoPlaySound: false,
    soundEnabled: false,
    stats: {
      totalWords: 100,
      learnedWords: 20,
      masteredWords: 5,
      wrongWords: 4,
      accuracyRate: 75,
      stageCounts: { new: 4, learning: 2, practicing: 1, review: 3, mastered: 5 },
      categoryBreakdown: [
        { category: 'animals', total: 15, learned: 6, mastered: 1 },
        { category: 'fruits', total: 10, learned: 2, mastered: 0 },
      ],
    },
    recommendation: {
      title: '先复习一下旧词',
      description: 'desc',
      focus: 'review' as const,
      suggestedCategory: 'animals',
      suggestedMode: 'e2c' as const,
    },
    reviewQueue: [],
    dailyPlan: {
      title: '今日学习任务',
      summary: 'summary',
      tasks: [
        { label: '先复习旧词', count: 3, mode: 'e2c' as const, kind: 'review' as const },
      ],
    },
    dailySummary: {
      completedTaskCount: 1,
      totalTaskCount: 3,
      learnedWords: 20,
      reviewWords: 3,
      message: '今天已经完成 1 项任务，继续保持～',
    },
    nextTaskRecommendation: {
      currentIndex: 0,
      nextIndex: 0,
      nextLabel: '先复习旧词',
      message: '下一步建议：先复习旧词',
    },
    completedDailyTaskKinds: [],
    onModeChange: vi.fn(),
    onStart: vi.fn(),
    onRoundSizeChange: vi.fn(),
    onCategoryChange: vi.fn(),
    onToggleAutoPlaySound: vi.fn(),
    onToggleSoundEnabled: vi.fn(),
    onStartReview: vi.fn(),
    onStartTask: vi.fn(),
    onResetDailyTasks: vi.fn(),
  };

  it('renders recommendation, daily plan and category gallery', () => {
    render(<HomePage {...baseProps} />);
    expect(screen.getByText('今日学习任务')).toBeInTheDocument();
    expect(screen.getByText('➡️ 下一项推荐')).toBeInTheDocument();
    expect(screen.getByText('🎒 主题入口')).toBeInTheDocument();
  });

  it('calls onStart when start button is clicked', () => {
    const onStart = vi.fn();
    render(<HomePage {...baseProps} onStart={onStart} />);
    fireEvent.click(screen.getByRole('button', { name: /开始复习|学习新词|开始学习/ }));
    expect(onStart).toHaveBeenCalled();
  });
});
