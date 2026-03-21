import { beforeEach, describe, expect, it } from 'vitest';
import { useProgressStore } from './progressStore';

describe('progressStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useProgressStore.setState({
      totalStars: 0,
      currentMode: 'e2c',
      learnedWordIds: [],
      wordProgressMap: {},
      lastStudyDate: undefined,
    });
  });

  it('adds stars', () => {
    useProgressStore.getState().addStars(2);
    expect(useProgressStore.getState().totalStars).toBe(2);
  });

  it('records seen words and learned ids', () => {
    useProgressStore.getState().recordSeen(1);
    const state = useProgressStore.getState();
    expect(state.learnedWordIds).toContain(1);
    expect(state.wordProgressMap[1].seenCount).toBe(1);
  });

  it('records correct and wrong results', () => {
    useProgressStore.getState().recordResult(1, true);
    useProgressStore.getState().recordResult(1, false);
    const progress = useProgressStore.getState().wordProgressMap[1];
    expect(progress.correctCount).toBe(1);
    expect(progress.wrongCount).toBe(1);
  });

  it('marks a word as mastered after enough correct results', () => {
    useProgressStore.getState().recordResult(1, true);
    useProgressStore.getState().recordResult(1, true);
    useProgressStore.getState().recordResult(1, true);
    expect(useProgressStore.getState().wordProgressMap[1].mastered).toBe(true);
  });
});
