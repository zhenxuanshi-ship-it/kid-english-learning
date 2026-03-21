import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TopicsPage } from './TopicsPage';

describe('TopicsPage', () => {
  const items = [
    { category: 'animals', label: '动物', total: 15, learned: 6, mastered: 1, progressPercent: 40, featuredWord: 'cat', featuredChinese: '猫', featuredVisual: { id: 1, english: 'cat', chinese: '猫', category: 'animals', level: 1 as const, difficulty: 1, emoji: '🐱' }, tagline: '认识可爱小动物朋友', recommendation: '已经学了 6 个，再看看 cat' },
    { category: 'fruits', label: '水果', total: 10, learned: 2, mastered: 0, progressPercent: 20, featuredWord: 'apple', featuredChinese: '苹果', featuredVisual: { id: 16, english: 'apple', chinese: '苹果', category: 'fruits', level: 2 as const, difficulty: 2, emoji: '🍎' }, tagline: '一起逛逛水果乐园', recommendation: '已经学了 2 个，再看看 apple' },
  ];

  it('starts selected topic category', () => {
    const onStartTopic = vi.fn();
    render(
      <TopicsPage
        items={items}
        selectedCategory="fruits"
        onSelectCategory={vi.fn()}
        onStartTopic={onStartTopic}
        onOpenSentencePractice={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '开始这个主题' }));
    expect(onStartTopic).toHaveBeenCalledWith('fruits');
  });
});
