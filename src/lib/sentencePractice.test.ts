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

  it('supports newly added sentence patterns', () => {
    const pattern = getSentencePattern('what_is_this');
    const exercises = getSentenceExercises('what_is_this');
    expect(pattern?.title).toBe('What is this?');
    expect(exercises).toHaveLength(3);
  });

  it('surfaces imported Y2 words inside sentence exercises', () => {
    const thisIs = getSentenceExercises('this_is').map((item) => item.english).join(' ');
    const iLike = getSentenceExercises('i_like').map((item) => item.english).join(' ');
    const iHave = getSentenceExercises('i_have').map((item) => item.english).join(' ');

    expect(thisIs).toContain('zebra');
    expect(iLike).toContain('watermelon');
    expect(iHave).toContain('sticker');
  });
});
