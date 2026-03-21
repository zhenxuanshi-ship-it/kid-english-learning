import { describe, expect, it } from 'vitest';
import { allWords } from './index';

describe('word resources', () => {
  it('provides an emoji resource for every word', () => {
    expect(allWords.every((word) => Boolean(word.emoji))).toBe(true);
  });

  it('includes a growing sample set of real image-backed words', () => {
    expect(allWords.filter((word) => Boolean(word.imageUrl)).length).toBeGreaterThanOrEqual(30);
  });

  it('includes newly imported step-1 words from the Y2 plan', () => {
    const importedWords = ['zebra', 'watermelon', 'crayon', 'classroom', 'umbrella', 'puddle'];
    expect(importedWords.every((english) => allWords.some((word) => word.english === english))).toBe(true);
  });

  it('includes newly imported missing step-2 words from the Y2 plan', () => {
    const importedWords = ['burger', 'sticker'];
    expect(importedWords.every((english) => allWords.some((word) => word.english === english))).toBe(true);
  });
});
