import { describe, expect, it } from 'vitest';
import { getAllowedModes, getInitialLearningStage, getNextLearningStage, getStagePriority } from './learningRules';

describe('learningRules', () => {
  it('returns new as initial stage', () => {
    expect(getInitialLearningStage()).toBe('new');
  });

  it('moves new words into learning after first attempt', () => {
    const next = getNextLearningStage({
      wordId: 1,
      seenCount: 1,
      correctCount: 0,
      wrongCount: 0,
      mastered: false,
      learningStage: 'new',
    }, true);
    expect(next).toBe('learning');
  });

  it('moves learning words into practicing after enough correct answers', () => {
    const next = getNextLearningStage({
      wordId: 1,
      seenCount: 2,
      correctCount: 1,
      wrongCount: 0,
      mastered: false,
      learningStage: 'learning',
    }, true);
    expect(next).toBe('practicing');
  });

  it('returns allowed modes by stage', () => {
    expect(getAllowedModes({ wordId: 1, seenCount: 0, correctCount: 0, wrongCount: 0, mastered: false, learningStage: 'new' })).toEqual(['e2c']);
    expect(getAllowedModes({ wordId: 1, seenCount: 1, correctCount: 1, wrongCount: 0, mastered: false, learningStage: 'review' })).toEqual(['e2c', 'c2e', 'spell_blank']);
  });

  it('defines review as highest priority and mastered as lowest', () => {
    expect(getStagePriority('review')).toBeLessThan(getStagePriority('learning'));
    expect(getStagePriority('mastered')).toBeGreaterThan(getStagePriority('practicing'));
  });
});
