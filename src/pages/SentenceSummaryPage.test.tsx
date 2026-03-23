import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SentenceSummaryPage } from './SentenceSummaryPage';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
      <button onClick={onClick}>{children}</button>
    ),
  },
}));

describe('SentenceSummaryPage', () => {
  it('renders score correctly', () => {
    render(<SentenceSummaryPage correctCount={8} roundTotal={10} onRestart={vi.fn()} onGoTopics={vi.fn()} />);
    expect(screen.getByText('8 / 10 题答对')).toBeInTheDocument();
  });

  it('renders pattern title', () => {
    render(<SentenceSummaryPage
      correctCount={5}
      roundTotal={5}
      pattern={{ id: 'this_is', title: 'This is ...', description: '', examples: [] }}
      onRestart={vi.fn()}
      onGoTopics={vi.fn()}
    />);
    expect(screen.getByText(/This is \.\.\./)).toBeInTheDocument();
  });

  it('calls onRestart when restart button clicked', () => {
    const onRestart = vi.fn();
    render(<SentenceSummaryPage correctCount={3} roundTotal={5} onRestart={onRestart} onGoTopics={vi.fn()} />);
    fireEvent.click(screen.getByText('再练一轮'));
    expect(onRestart).toHaveBeenCalled();
  });

  it('calls onGoTopics when topic button clicked', () => {
    const onGoTopics = vi.fn();
    render(<SentenceSummaryPage correctCount={3} roundTotal={5} onRestart={vi.fn()} onGoTopics={onGoTopics} />);
    fireEvent.click(screen.getByText('回主题页'));
    expect(onGoTopics).toHaveBeenCalled();
  });

  it('shows review button when stage is review', () => {
    const onGoReviewPattern = vi.fn();
    render(<SentenceSummaryPage
      correctCount={4}
      roundTotal={5}
      stage="review"
      onRestart={vi.fn()}
      onGoTopics={vi.fn()}
      onGoReviewPattern={onGoReviewPattern}
    />);
    expect(screen.getByText('继续复习这个句型')).toBeInTheDocument();
  });

  it('calls onGoReviewPattern when review button clicked', () => {
    const onGoReviewPattern = vi.fn();
    render(<SentenceSummaryPage
      correctCount={4}
      roundTotal={5}
      stage="review"
      onRestart={vi.fn()}
      onGoTopics={vi.fn()}
      onGoReviewPattern={onGoReviewPattern}
    />);
    fireEvent.click(screen.getByText('继续复习这个句型'));
    expect(onGoReviewPattern).toHaveBeenCalled();
  });

  it('renders examples', () => {
    render(<SentenceSummaryPage
      correctCount={5}
      roundTotal={5}
      pattern={{ id: 'this_is', title: 'This is', description: '', examples: ['This is a cat', 'This is a dog'] }}
      onRestart={vi.fn()}
      onGoTopics={vi.fn()}
    />);
    expect(screen.getByText(/This is a cat/)).toBeInTheDocument();
  });
});
