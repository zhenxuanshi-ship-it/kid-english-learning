import type { Word } from '../../../types/word';
import { sample, shuffle } from '../../../lib/helpers';

export function buildChoiceOptions(word: Word, bank: Word[]): string[] {
  const sameCategory = bank.filter((item) => item.id !== word.id && item.category === word.category);
  const fallback = bank.filter((item) => item.id !== word.id);
  const distractors = sameCategory.length >= 3 ? sample(sameCategory, 3) : sample(fallback, 3);
  return shuffle([word.chinese, ...distractors.map((item) => item.chinese)]);
}
