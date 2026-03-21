import { describe, expect, it } from 'vitest';
import { allWords } from '../data/words';
import { getWordVisualResource } from './images';

describe('getWordVisualResource', () => {
  it('returns emoji fallback and category cover when there is no imageUrl', () => {
    const word = allWords[0];
    const resource = getWordVisualResource(word);
    expect(resource.imageUrl).toBeUndefined();
    expect(resource.fallbackEmoji).toBeTruthy();
    expect(resource.categoryCover).toBeTruthy();
  });
});
