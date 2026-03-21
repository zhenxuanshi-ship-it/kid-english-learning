import type { WordProgress } from '../features/progress/types';
import type { Word } from '../types/word';

export interface ReviewWordItem {
  wordId: number;
  english: string;
  chinese: string;
  wrongCount: number;
  correctCount: number;
  learningStage: WordProgress['learningStage'];
  lastMode?: WordProgress['lastMode'];
  lastReviewedAt?: number;
}

export function buildReviewQueue(words: Word[], wordProgressMap: Record<number, WordProgress>): ReviewWordItem[] {
  const items: ReviewWordItem[] = [];

  Object.values(wordProgressMap)
    .filter((progress) => progress.wrongCount > 0)
    .forEach((progress) => {
      const word = words.find((item) => item.id === progress.wordId);
      if (!word) return;
      items.push({
        wordId: progress.wordId,
        english: word.english,
        chinese: word.chinese,
        wrongCount: progress.wrongCount,
        correctCount: progress.correctCount,
        learningStage: progress.learningStage,
        lastMode: progress.lastMode,
        lastReviewedAt: progress.lastReviewedAt,
      });
    });

  return items.sort((a, b) => {
    if (b.wrongCount !== a.wrongCount) return b.wrongCount - a.wrongCount;
    return (b.lastReviewedAt ?? 0) - (a.lastReviewedAt ?? 0);
  });
}
