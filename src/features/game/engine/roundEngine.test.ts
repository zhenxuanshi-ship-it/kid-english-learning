import { describe, expect, it } from 'vitest';
import { allWords } from '../../../data/words';
import { createPriorityRound, createRound } from './roundEngine';

describe('createRound', () => {
  it('returns the requested number of ids', () => {
    const round = createRound(allWords, 5);
    expect(round).toHaveLength(5);
  });

  it('filters by category when provided', () => {
    const round = createRound(allWords, 4, 'animals');
    const words = round.map((id) => allWords.find((item) => item.id === id));
    expect(words.every((word) => word?.category === 'animals')).toBe(true);
  });

  it('falls back to all words when category is missing', () => {
    const round = createRound(allWords, 3, 'not-exists');
    expect(round).toHaveLength(3);
  });

  it('prioritizes review and learning stages before mastered', () => {
    const round = createPriorityRound(
      allWords,
      {
        1: { wordId: 1, seenCount: 1, correctCount: 0, wrongCount: 2, mastered: false, learningStage: 'review' },
        2: { wordId: 2, seenCount: 1, correctCount: 1, wrongCount: 0, mastered: false, learningStage: 'learning' },
        3: { wordId: 3, seenCount: 5, correctCount: 5, wrongCount: 0, mastered: true, learningStage: 'mastered' },
      },
      3,
      'animals',
    );
    expect(round[0]).toBe(1);
    expect(round[1]).toBe(2);
  });
});
