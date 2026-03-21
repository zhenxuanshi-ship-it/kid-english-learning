import { describe, expect, it } from 'vitest';
import { allWords } from '../data/words';
import { buildReviewQueue } from './review';

describe('buildReviewQueue', () => {
  it('returns only words with wrongCount > 0 sorted by wrongCount desc', () => {
    const queue = buildReviewQueue(allWords, {
      1: { wordId: 1, seenCount: 3, correctCount: 1, wrongCount: 1, mastered: false, learningStage: 'review', lastReviewedAt: 1 },
      2: { wordId: 2, seenCount: 4, correctCount: 1, wrongCount: 3, mastered: false, learningStage: 'review', lastReviewedAt: 2 },
      11: { wordId: 11, seenCount: 1, correctCount: 1, wrongCount: 0, mastered: false, learningStage: 'learning', lastReviewedAt: 3 },
    });

    expect(queue).toHaveLength(2);
    expect(queue[0].wordId).toBe(2);
    expect(queue[1].wordId).toBe(1);
  });
});
