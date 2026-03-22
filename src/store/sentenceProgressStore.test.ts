import { beforeEach, describe, expect, it } from 'vitest';
import { useSentenceProgressStore } from './sentenceProgressStore';

describe('sentenceProgressStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSentenceProgressStore.setState({ progressMap: {} as Partial<Record<import('../types/sentence').SentencePatternId, import('../types/sentence').SentenceProgress>> });
  });

  it('records seen count', () => {
    useSentenceProgressStore.getState().recordSeen('this_is');
    expect(useSentenceProgressStore.getState().progressMap.this_is?.seenCount).toBe(1);
    expect(useSentenceProgressStore.getState().progressMap.this_is?.stage).toBe('learning');
  });

  it('records correct result and mastery', () => {
    useSentenceProgressStore.getState().recordResult('i_like', true);
    useSentenceProgressStore.getState().recordResult('i_like', true);
    useSentenceProgressStore.getState().recordResult('i_like', true);
    expect(useSentenceProgressStore.getState().progressMap.i_like?.mastered).toBe(true);
    expect(useSentenceProgressStore.getState().progressMap.i_like?.stage).toBe('mastered');
  });

  it('marks a sentence pattern for review after repeated mistakes', () => {
    useSentenceProgressStore.getState().recordResult('it_is', false);
    useSentenceProgressStore.getState().recordResult('it_is', false);
    expect(useSentenceProgressStore.getState().progressMap.it_is?.stage).toBe('review');
  });
});
