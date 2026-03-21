import type { Word } from '../../../types/word';
import { sample } from '../../../lib/helpers';

export function createRound(words: Word[], size = 5): number[] {
  return sample(words, Math.min(size, words.length)).map((word) => word.id);
}
