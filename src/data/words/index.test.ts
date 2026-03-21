import { describe, expect, it } from 'vitest';
import { allWords } from './index';

describe('word resources', () => {
  it('provides an emoji resource for every word', () => {
    expect(allWords.every((word) => Boolean(word.emoji))).toBe(true);
  });

  it('includes a sample set of real image-backed words', () => {
    expect(allWords.filter((word) => Boolean(word.imageUrl)).length).toBeGreaterThanOrEqual(10);
  });
});
