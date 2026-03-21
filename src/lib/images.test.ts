import { describe, expect, it } from 'vitest';
import { allWords } from '../data/words';
import { getWordVisualResource } from './images';

describe('getWordVisualResource', () => {
  it('returns a real imageUrl for sample image-backed words', () => {
    const word = allWords.find((item) => item.english === 'cat');
    const resource = getWordVisualResource(word!);
    expect(resource.imageUrl).toBeTruthy();
  });

  it('returns emoji fallback and category cover when there is no imageUrl', () => {
    const word = allWords.find((item) => item.english === 'lion');
    const resource = getWordVisualResource(word!);
    expect(resource.imageUrl).toBeUndefined();
    expect(resource.fallbackEmoji).toBeTruthy();
    expect(resource.categoryCover).toBeTruthy();
  });
});
