import { describe, expect, it } from 'vitest';
import { createSentenceRound, getSentenceExercises, getSentencePattern } from './sentencePractice';

describe('sentencePractice', () => {
  it('returns sentence pattern metadata', () => {
    const pattern = getSentencePattern('this_is');
    expect(pattern?.title).toBe('This is ...');
  });

  it('creates a small round for a pattern', () => {
    const exercises = getSentenceExercises('i_like');
    const round = createSentenceRound('i_like', 2);
    expect(exercises.length).toBeGreaterThanOrEqual(2);
    expect(round).toHaveLength(2);
  });
});
