import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RoundSummary } from './RoundSummary';

describe('RoundSummary', () => {
  const stats = {
    totalWords: 100,
    learnedWords: 20,
    masteredWords: 5,
    wrongWords: 4,
    accuracyRate: 75,
    stageCounts: { new: 4, learning: 2, practicing: 1, review: 3, mastered: 5 },
    categoryBreakdown: [],
  };

  it('shows completed daily task feedback when provided', () => {
    render(
      <RoundSummary
        correctCount={4}
        roundTotal={5}
        stars={3}
        wrongWordIds={[]}
        completedTaskLabel="认识新词"
        completedTaskReward="太棒啦！认识新词完成得很棒～"
        nextTaskLabel="先复习旧词"
        sentencePatternSuggestion={{ id: 'this_is', title: 'This is ...', description: '认识“这是……”这种句子。', examples: ['This is a cat.'] }}
        onRestart={vi.fn()}
        onRetryWrong={vi.fn()}
        onGoHome={vi.fn()}
        onGoTopics={vi.fn()}
        onGoReview={vi.fn()}
        onGoNextTask={vi.fn()}
        onGoSentencePractice={vi.fn()}
        stats={stats}
      />,
    );

    expect(screen.getByText(/已推进今日任务：认识新词/)).toBeInTheDocument();
    expect(screen.getByText(/\+1 今日任务/)).toBeInTheDocument();
    expect(screen.getByText(/太棒啦/)).toBeInTheDocument();
    expect(screen.getByText(/结算页顺手练句子/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /去练这个句型/ })).toBeInTheDocument();
    expect(screen.getByText(/下一步去哪/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /继续下一项：先复习旧词/ })).toBeInTheDocument();
  });
});
