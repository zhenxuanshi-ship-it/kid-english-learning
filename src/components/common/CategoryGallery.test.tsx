import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CategoryGallery } from './CategoryGallery';

describe('CategoryGallery', () => {
  const items = [
    { category: 'animals', label: '动物', total: 15, learned: 6, mastered: 1, progressPercent: 40, featuredWord: 'cat', featuredChinese: '猫', tagline: '认识可爱小动物朋友', recommendation: '已经学了 6 个，再看看 cat' },
    { category: 'fruits', label: '水果', total: 10, learned: 2, mastered: 0, progressPercent: 20, featuredWord: 'apple', featuredChinese: '苹果', tagline: '一起逛逛水果乐园', recommendation: '已经学了 2 个，再看看 apple' },
  ];

  it('renders category cards and all button', () => {
    render(
      <CategoryGallery
        items={items}
        selectedCategory="all"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText('全部主题')).toBeInTheDocument();
    expect(screen.getByText('动物')).toBeInTheDocument();
    expect(screen.getByText('水果')).toBeInTheDocument();
    expect(screen.getByText(/认识可爱小动物朋友/)).toBeInTheDocument();
    expect(screen.getByText(/已经学了 6 个，再看看 cat/)).toBeInTheDocument();
    expect(screen.getByText(/已学 6\/15/)).toBeInTheDocument();
    expect(screen.getByText(/猫 · cat/)).toBeInTheDocument();
  });

  it('calls onSelect when category is clicked', () => {
    const onSelect = vi.fn();
    render(
      <CategoryGallery
        items={items}
        selectedCategory="all"
        onSelect={onSelect}
      />,
    );

    const animalButtons = screen.getAllByRole('button');
    const animalButton = animalButtons.find((button) => button.textContent?.includes('动物'));
    expect(animalButton).toBeTruthy();
    fireEvent.click(animalButton!);
    expect(onSelect).toHaveBeenCalledWith('animals');
  });
});
