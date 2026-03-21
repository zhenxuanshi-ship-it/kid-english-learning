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
  });

  it('records correct result and mastery', () => {
    useSentenceProgressStore.getState().recordResult('i_like', true);
    useSentenceProgressStore.getState().recordResult('i_like', true);
    useSentenceProgressStore.getState().recordResult('i_like', true);
    expect(useSentenceProgressStore.getState().progressMap.i_like?.mastered).toBe(true);
  });
});
