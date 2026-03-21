import { describe, expect, it } from 'vitest';
import { getSentenceRecommendation } from './sentenceRecommendation';

describe('sentenceRecommendation', () => {
  it('recommends unseen patterns before mastered ones', () => {
    const result = getSentenceRecommendation({
      this_is: {
        patternId: 'this_is',
        seenCount: 1,
        correctCount: 3,
        wrongCount: 0,
        mastered: true,
        lastPracticedAt: 100,
      },
    });

    expect(result.recommendedPattern?.id).not.toBe('this_is');
  });

  it('prefers continuing a recently practiced unmastered pattern', () => {
    const result = getSentenceRecommendation({
      i_like: {
        patternId: 'i_like',
        seenCount: 2,
        correctCount: 1,
        wrongCount: 2,
        mastered: false,
        lastPracticedAt: 200,
      },
      i_have: {
        patternId: 'i_have',
        seenCount: 1,
        correctCount: 0,
        wrongCount: 1,
        mastered: false,
        lastPracticedAt: 100,
      },
    });

    expect(result.continuePattern?.id).toBe('i_like');
  });
});
