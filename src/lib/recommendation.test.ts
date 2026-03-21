import { describe, expect, it } from 'vitest';
import { getHomeRecommendation } from './recommendation';

describe('getHomeRecommendation', () => {
  const baseStats = {
    totalWords: 70,
    learnedWords: 10,
    masteredWords: 2,
    wrongWords: 3,
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

  it('prioritizes review words first', () => {
    const recommendation = getHomeRecommendation({
      ...baseStats,
      stageCounts: { ...baseStats.stageCounts, review: 3, new: 5 },
    });
    expect(recommendation.focus).toBe('review');
  });

  it('recommends new words when there are no review words', () => {
    const recommendation = getHomeRecommendation({
      ...baseStats,
      stageCounts: { ...baseStats.stageCounts, new: 4 },
    });
    expect(recommendation.focus).toBe('new');
  });

  it('falls back to mixed practice when there is no obvious priority', () => {
    const recommendation = getHomeRecommendation(baseStats);
    expect(recommendation.focus).toBe('mixed');
  });
});
