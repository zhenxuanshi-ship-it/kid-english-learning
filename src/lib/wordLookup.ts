import { allWords } from '../data/words';
import type { Word } from '../types/word';

function normalizeEnglish(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function findWordByEnglish(english: string): Word | undefined {
  const normalized = normalizeEnglish(english);
  return allWords.find((word) => {
    if (normalizeEnglish(word.english) === normalized) return true;
    return word.sourceAliases?.some((alias) => normalizeEnglish(alias) === normalized) ?? false;
  });
}

export function hasWordEnglishMatch(english: string): boolean {
  return Boolean(findWordByEnglish(english));
}
