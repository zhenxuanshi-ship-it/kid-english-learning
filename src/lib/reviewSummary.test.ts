import { describe, expect, it } from 'vitest';
import { buildReviewSummary } from './reviewSummary';

describe('buildReviewSummary', () => {
  it('builds empty summary', () => {
    const summary = buildReviewSummary([]);
    expect(summary.total).toBe(0);
    expect(summary.message).toContain('没有');
  });

  it('builds summary with high-priority info', () => {
    const summary = buildReviewSummary([
      { wordId: 1, english: 'cat', chinese: '猫', wrongCount: 3, correctCount: 1, learningStage: 'review', priorityScore: 30, priorityLabel: 'high' },
      { wordId: 2, english: 'apple', chinese: '苹果', wrongCount: 1, correctCount: 1, learningStage: 'learning', priorityScore: 18, priorityLabel: 'medium' },
    ]);
    expect(summary.highPriorityCount).toBe(1);
    expect(summary.nextWordLabel).toBe('猫 · cat');
  });
});
