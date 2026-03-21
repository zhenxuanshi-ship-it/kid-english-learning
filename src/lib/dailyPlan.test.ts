import { describe, expect, it } from 'vitest';
import { buildDailyPlan } from './dailyPlan';

describe('buildDailyPlan', () => {
  const baseStats = {
    totalWords: 100,
    learnedWords: 20,
    masteredWords: 5,
    wrongWords: 4,
    accuracyRate: 75,
    stageCounts: {
      new: 0,
      learning: 0,
      practicing: 0,
      review: 0,
      mastered: 0,
    },
    categoryBreakdown: [],
  };

  it('builds review, new and practice tasks when available', () => {
    const plan = buildDailyPlan({
      ...baseStats,
      stageCounts: { ...baseStats.stageCounts, review: 3, new: 4, learning: 2, practicing: 1 },
    });

    expect(plan.tasks).toHaveLength(3);
    expect(plan.tasks[0].kind).toBe('review');
    expect(plan.tasks[1].kind).toBe('new');
    expect(plan.tasks[2].kind).toBe('practice');
  });

  it('falls back to a mixed practice task when no backlog exists', () => {
    const plan = buildDailyPlan(baseStats);
    expect(plan.tasks).toHaveLength(1);
    expect(plan.tasks[0].mode).toBe('c2e');
  });
});
