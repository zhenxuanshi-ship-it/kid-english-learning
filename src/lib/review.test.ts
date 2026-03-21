import { describe, expect, it } from 'vitest';
import { allWords } from '../data/words';
import { buildReviewQueue, getReviewPriority } from './review';

describe('buildReviewQueue', () => {
  it('returns only words with wrongCount > 0 sorted by priority', () => {
    const queue = buildReviewQueue(allWords, {
      1: { wordId: 1, seenCount: 3, correctCount: 1, wrongCount: 1, mastered: false, learningStage: 'review', lastReviewedAt: 1, lastResult: 'wrong', lastMode: 'e2c' },
      2: { wordId: 2, seenCount: 4, correctCount: 1, wrongCount: 3, mastered: false, learningStage: 'review', lastReviewedAt: 2, lastResult: 'wrong', lastMode: 'c2e' },
      11: { wordId: 11, seenCount: 1, correctCount: 1, wrongCount: 0, mastered: false, learningStage: 'learning', lastReviewedAt: 3 },
    });

    expect(queue).toHaveLength(2);
    expect(queue[0].wordId).toBe(2);
    expect(queue[0].priorityLabel).toBe('high');
    expect(queue[1].wordId).toBe(1);
  });

  it('gives harder recent wrong answers a higher review priority', () => {
    const light = getReviewPriority({
      wordId: 1,
      seenCount: 2,
      correctCount: 2,
      wrongCount: 1,
      mastered: false,
      learningStage: 'learning',
      lastResult: 'correct',
      lastMode: 'e2c',
      lastReviewedAt: Date.now() - 1000 * 60 * 60 * 24,
    });
    const heavy = getReviewPriority({
      wordId: 2,
      seenCount: 4,
      correctCount: 1,
      wrongCount: 3,
      mastered: false,
      learningStage: 'review',
      lastResult: 'wrong',
      lastMode: 'spell_blank',
      lastReviewedAt: Date.now(),
    });

    expect(heavy).toBeGreaterThan(light);
  });
});
