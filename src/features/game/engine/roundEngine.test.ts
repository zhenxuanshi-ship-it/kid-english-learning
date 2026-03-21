import { describe, expect, it } from 'vitest';
import { allWords } from '../../../data/words';
import { createRound } from './roundEngine';

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
});
