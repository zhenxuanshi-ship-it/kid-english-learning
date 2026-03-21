import { describe, expect, it } from 'vitest';
import { buildDailySummary } from './dailySummary';

describe('buildDailySummary', () => {
  const stats = {
    totalWords: 100,
    learnedWords: 20,
    masteredWords: 5,
    wrongWords: 4,
    accuracyRate: 75,
    stageCounts: {
      new: 3,
      learning: 2,
      practicing: 1,
      review: 4,
      mastered: 5,
    },
    categoryBreakdown: [],
  };

  it('builds an in-progress summary', () => {
    const summary = buildDailySummary(['review'], stats);
    expect(summary.completedTaskCount).toBe(1);
    expect(summary.totalTaskCount).toBeGreaterThanOrEqual(1);
  });

  it('shows completion message when all task kinds are done', () => {
    const summary = buildDailySummary(['review', 'new', 'practice'], stats);
    expect(summary.message).toContain('完成');
  });
});
