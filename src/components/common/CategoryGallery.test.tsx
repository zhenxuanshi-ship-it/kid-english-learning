import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CategoryGallery } from './CategoryGallery';

describe('CategoryGallery', () => {
  it('renders category cards and all button', () => {
    render(
      <CategoryGallery
        categories={['animals', 'fruits']}
        selectedCategory="all"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText('全部主题')).toBeInTheDocument();
    expect(screen.getByText('动物')).toBeInTheDocument();
    expect(screen.getByText('水果')).toBeInTheDocument();
  });

  it('calls onSelect when category is clicked', () => {
    const onSelect = vi.fn();
    render(
      <CategoryGallery
        categories={['animals', 'fruits']}
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
