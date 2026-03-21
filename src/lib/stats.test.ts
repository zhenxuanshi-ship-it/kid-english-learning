import { describe, expect, it } from 'vitest';
import { allWords } from '../data/words';
import { buildLearningStats } from './stats';

describe('buildLearningStats', () => {
  it('builds aggregate learning statistics', () => {
    const stats = buildLearningStats(allWords, {
      1: { wordId: 1, seenCount: 2, correctCount: 2, wrongCount: 0, mastered: true, learningStage: 'mastered' },
      2: { wordId: 2, seenCount: 3, correctCount: 1, wrongCount: 2, mastered: false, learningStage: 'review' },
      16: { wordId: 16, seenCount: 1, correctCount: 1, wrongCount: 0, mastered: false, learningStage: 'learning' },
    });

    expect(stats.totalWords).toBe(allWords.length);
    expect(stats.learnedWords).toBe(3);
    expect(stats.masteredWords).toBe(1);
    expect(stats.wrongWords).toBe(1);
    expect(stats.accuracyRate).toBe(67);
    expect(stats.stageCounts.mastered).toBeGreaterThanOrEqual(1);
    expect(stats.stageCounts.review).toBeGreaterThanOrEqual(1);
  });

  it('includes category breakdown', () => {
    const stats = buildLearningStats(allWords, {
      1: { wordId: 1, seenCount: 1, correctCount: 1, wrongCount: 0, mastered: true, learningStage: 'mastered' },
      16: { wordId: 16, seenCount: 1, correctCount: 0, wrongCount: 1, mastered: false, learningStage: 'review' },
    });

    const animals = stats.categoryBreakdown.find((item) => item.category === 'animals');
    const fruits = stats.categoryBreakdown.find((item) => item.category === 'fruits');

    expect(animals?.learned).toBeGreaterThanOrEqual(1);
    expect(fruits?.learned).toBeGreaterThanOrEqual(1);
  });
});
