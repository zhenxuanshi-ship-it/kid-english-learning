import type { Word } from '../../../types/word';
import { sample } from '../../../lib/helpers';

export function createRound(words: Word[], size = 5, category = 'all'): number[] {
  const source = category === 'all' ? words : words.filter((word) => word.category === category);
  const picked = source.length > 0 ? source : words;
  return sample(picked, Math.min(size, picked.length)).map((word) => word.id);
}
