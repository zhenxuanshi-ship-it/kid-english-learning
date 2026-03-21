import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ReviewPage } from './ReviewPage';

describe('ReviewPage', () => {
  it('shows review summary and starts review', () => {
    const onStartReview = vi.fn();
    render(
      <ReviewPage
        items={[
          { wordId: 1, english: 'cat', chinese: '猫', wrongCount: 3, correctCount: 1, learningStage: 'review', priorityScore: 30, priorityLabel: 'high' },
          { wordId: 2, english: 'apple', chinese: '苹果', wrongCount: 1, correctCount: 1, learningStage: 'learning', priorityScore: 18, priorityLabel: 'medium' },
        ]}
        onStartReview={onStartReview}
      />,
    );

    expect(screen.getByText('复习中心')).toBeInTheDocument();
    expect(screen.getByText(/推荐先复习：猫 · cat/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '开始错题复习' }));
    expect(onStartReview).toHaveBeenCalled();
  });
});
