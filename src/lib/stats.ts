import type { WordProgress } from '../features/progress/types';
import type { Word } from '../types/word';

export interface LearningStats {
  totalWords: number;
  learnedWords: number;
  masteredWords: number;
  wrongWords: number;
  accuracyRate: number;
  categoryBreakdown: Array<{
    category: string;
    total: number;
    learned: number;
    mastered: number;
  }>;
}

export function buildLearningStats(words: Word[], wordProgressMap: Record<number, WordProgress>): LearningStats {
  const learnedIds = new Set<number>();
  let masteredWords = 0;
  let wrongWords = 0;
  let totalCorrect = 0;
  let totalWrong = 0;

  Object.values(wordProgressMap).forEach((progress) => {
    if (progress.seenCount > 0) learnedIds.add(progress.wordId);
    if (progress.mastered) masteredWords += 1;
    if (progress.wrongCount > 0) wrongWords += 1;
    totalCorrect += progress.correctCount;
    totalWrong += progress.wrongCount;
  });

  const totalAttempts = totalCorrect + totalWrong;
  const accuracyRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const categoryMap = new Map<string, { total: number; learned: number; mastered: number }>();

  words.forEach((word) => {
    const current = categoryMap.get(word.category) ?? { total: 0, learned: 0, mastered: 0 };
    current.total += 1;
    if (learnedIds.has(word.id)) current.learned += 1;
    if (wordProgressMap[word.id]?.mastered) current.mastered += 1;
    categoryMap.set(word.category, current);
  });

  return {
    totalWords: words.length,
    learnedWords: learnedIds.size,
    masteredWords,
    wrongWords,
    accuracyRate,
    categoryBreakdown: Array.from(categoryMap.entries()).map(([category, value]) => ({
      category,
      ...value,
    })),
  };
}
