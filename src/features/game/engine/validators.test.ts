import { describe, expect, it } from 'vitest';
import { isSpellingCorrect, normalizeAnswer } from './validators';

describe('validators', () => {
  it('normalizes spaces and case', () => {
    expect(normalizeAnswer(' Apple ')).toBe('apple');
  });

  it('matches spelling ignoring case and spaces', () => {
    expect(isSpellingCorrect(' Apple ', 'apple')).toBe(true);
  });

  it('returns false for incorrect spelling', () => {
    expect(isSpellingCorrect('appla', 'apple')).toBe(false);
  });
});
