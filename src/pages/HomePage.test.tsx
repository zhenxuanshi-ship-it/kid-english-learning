import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  const baseProps = {
    mode: 'e2c' as const,
    totalStars: 5,
    categoryItems: [
      { category: 'animals', label: '动物', total: 15, learned: 6, mastered: 1, progressPercent: 40, featuredWord: 'cat', featuredChinese: '猫', featuredVisual: { id: 1, english: 'cat', chinese: '猫', category: 'animals', level: 1 as const, difficulty: 1, emoji: '🐱' }, tagline: '认识可爱小动物朋友', recommendation: '已经学了 6 个，再看看 cat' },
      { category: 'fruits', label: '水果', total: 10, learned: 2, mastered: 0, progressPercent: 20, featuredWord: 'apple', featuredChinese: '苹果', featuredVisual: { id: 16, english: 'apple', chinese: '苹果', category: 'fruits', level: 2 as const, difficulty: 2, emoji: '🍎' }, tagline: '一起逛逛水果乐园', recommendation: '已经学了 2 个，再看看 apple' },
    ],
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
    sentenceRecommendedPattern: { id: 'i_like' as const, title: 'I like ...', description: '认识“我喜欢……”这种句子。', examples: ['I like apples.', 'I like dogs.'] },
    sentenceContinuePattern: undefined,
    completedDailyTaskKinds: [],
    onModeChange: vi.fn(),
    onStart: vi.fn(),
    onOpenTopics: vi.fn(),
    onOpenReview: vi.fn(),
    onOpenSentencePractice: vi.fn(),
    onStartTask: vi.fn(),
    onResetDailyTasks: vi.fn(),
  };

  it('renders a short home with task hub and quick entries', () => {
    render(<HomePage {...baseProps} />);
    expect(screen.getByText('继续今日任务')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /主题学习/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /复习错题/ })).toBeInTheDocument();
  });

  it('opens topics entry when topics shortcut is clicked', () => {
    const onOpenTopics = vi.fn();
    render(<HomePage {...baseProps} onOpenTopics={onOpenTopics} />);
    fireEvent.click(screen.getByRole('button', { name: /主题学习/ }));
    expect(onOpenTopics).toHaveBeenCalled();
  });
});
