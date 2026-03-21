import { describe, expect, it } from 'vitest';
import { getHomeSentenceSpotlight, getSentenceRecommendation, getSummarySentenceSpotlight, getTopicSentenceSpotlight } from './sentenceRecommendation';

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

  it('can prioritize category-linked sentence patterns', () => {
    const result = getSentenceRecommendation({}, ['it_is']);
    expect(result.orderedPatterns[0]?.id).toBe('it_is');
  });

  it('home spotlight prefers continuing unfinished practice', () => {
    const pattern = getHomeSentenceSpotlight({
      i_like: {
        patternId: 'i_like',
        seenCount: 2,
        correctCount: 1,
        wrongCount: 1,
        mastered: false,
        lastPracticedAt: 200,
      },
    }, ['it_is']);

    expect(pattern?.id).toBe('i_like');
  });

  it('topic spotlight prefers linked patterns for the current topic', () => {
    const pattern = getTopicSentenceSpotlight({}, ['it_is']);
    expect(pattern?.id).toBe('it_is');
  });

  it('summary spotlight prefers linked patterns right after a round', () => {
    const pattern = getSummarySentenceSpotlight({}, ['this_is']);
    expect(pattern?.id).toBe('this_is');
  });
});
