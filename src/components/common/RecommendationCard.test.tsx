import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecommendationCard } from './RecommendationCard';

describe('RecommendationCard', () => {
  it('renders suggested category and mode', () => {
    render(
      <RecommendationCard
        recommendation={{
          title: '先复习一下旧词',
          description: 'desc',
          focus: 'review',
          suggestedCategory: 'animals',
          suggestedMode: 'e2c',
        }}
      />,
    );

    expect(screen.getByText(/推荐主题/)).toBeInTheDocument();
    expect(screen.getByText(/推荐方式/)).toBeInTheDocument();
  });

  it('calls category action when button is clicked', () => {
    const onApplyCategory = vi.fn();
    render(
      <RecommendationCard
        recommendation={{
          title: '今天先认识新词',
          description: 'desc',
          focus: 'new',
          suggestedCategory: 'fruits',
          suggestedMode: 'e2c',
        }}
        onApplyCategory={onApplyCategory}
      />,
    );

    fireEvent.click(screen.getByText('切到这个主题'));
    expect(onApplyCategory).toHaveBeenCalledWith('fruits');
  });
});
