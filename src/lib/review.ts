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
  priorityScore: number;
  priorityLabel: 'high' | 'medium' | 'light';
}

export function getReviewPriority(progress: WordProgress): number {
  let score = progress.wrongCount * 10;

  if (progress.learningStage === 'review') score += 12;
  if (progress.lastResult === 'wrong') score += 8;
  if (progress.lastMode === 'spell_blank' || progress.lastMode === 'c2e') score += 4;

  const recencyBoost = progress.lastReviewedAt ? Math.max(0, 5 - Math.floor((Date.now() - progress.lastReviewedAt) / (1000 * 60 * 60 * 6))) : 0;
  score += recencyBoost;

  return score;
}

function getPriorityLabel(score: number): ReviewWordItem['priorityLabel'] {
  if (score >= 28) return 'high';
  if (score >= 16) return 'medium';
  return 'light';
}

export function buildReviewQueue(words: Word[], wordProgressMap: Record<number, WordProgress>): ReviewWordItem[] {
  const items: ReviewWordItem[] = [];

  Object.values(wordProgressMap)
    .filter((progress) => progress.wrongCount > 0)
    .forEach((progress) => {
      const word = words.find((item) => item.id === progress.wordId);
      if (!word) return;
      const priorityScore = getReviewPriority(progress);
      items.push({
        wordId: progress.wordId,
        english: word.english,
        chinese: word.chinese,
        wrongCount: progress.wrongCount,
        correctCount: progress.correctCount,
        learningStage: progress.learningStage,
        lastMode: progress.lastMode,
        lastReviewedAt: progress.lastReviewedAt,
        priorityScore,
        priorityLabel: getPriorityLabel(priorityScore),
      });
    });

  return items.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
    if (b.wrongCount !== a.wrongCount) return b.wrongCount - a.wrongCount;
    return (b.lastReviewedAt ?? 0) - (a.lastReviewedAt ?? 0);
  });
}
