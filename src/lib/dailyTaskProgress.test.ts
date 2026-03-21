import { describe, expect, it } from 'vitest';
import { didCompleteDailyTask } from './dailyTaskProgress';

describe('didCompleteDailyTask', () => {
  const roundStartStages = {
    1: 'new',
    2: 'review',
    3: 'learning',
    4: 'practicing',
    5: 'mastered',
  } as const;

  it('matches new tasks only for new-stage words', () => {
    expect(didCompleteDailyTask('new', [1, 5], roundStartStages)).toBe(true);
    expect(didCompleteDailyTask('new', [2, 3], roundStartStages)).toBe(false);
  });

  it('matches review tasks only for review-stage words', () => {
    expect(didCompleteDailyTask('review', [2], roundStartStages)).toBe(true);
    expect(didCompleteDailyTask('review', [1, 3], roundStartStages)).toBe(false);
  });

  it('matches practice tasks for learning or practicing words', () => {
    expect(didCompleteDailyTask('practice', [3], roundStartStages)).toBe(true);
    expect(didCompleteDailyTask('practice', [4], roundStartStages)).toBe(true);
    expect(didCompleteDailyTask('practice', [1, 2], roundStartStages)).toBe(false);
  });
});
