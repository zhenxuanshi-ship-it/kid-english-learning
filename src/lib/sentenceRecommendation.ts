import { sentencePatterns } from '../data/sentences';
import type { SentencePattern, SentencePatternId, SentenceProgress } from '../types/sentence';

export interface SentenceRecommendation {
  continuePattern?: SentencePattern;
  recommendedPattern?: SentencePattern;
  orderedPatterns: SentencePattern[];
}

function getPriorityScore(progress?: SentenceProgress): number {
  if (!progress) return 1000;
  if (progress.mastered) return -100;
  return progress.wrongCount * 100 + progress.seenCount * 10 - progress.correctCount * 20;
}

export function getSentenceRecommendation(
  progressMap: Partial<Record<SentencePatternId, SentenceProgress>>,
): SentenceRecommendation {
  const orderedPatterns = [...sentencePatterns].sort((a, b) => {
    const progressA = progressMap[a.id];
    const progressB = progressMap[b.id];
    const scoreDiff = getPriorityScore(progressB) - getPriorityScore(progressA);
    if (scoreDiff !== 0) return scoreDiff;
    const lastA = progressA?.lastPracticedAt ?? 0;
    const lastB = progressB?.lastPracticedAt ?? 0;
    return lastB - lastA;
  });

  const continuePattern = [...sentencePatterns]
    .filter((pattern) => {
      const progress = progressMap[pattern.id];
      return progress && !progress.mastered && progress.seenCount > 0;
    })
    .sort((a, b) => (progressMap[b.id]?.lastPracticedAt ?? 0) - (progressMap[a.id]?.lastPracticedAt ?? 0))[0];

  const recommendedPattern = orderedPatterns.find((pattern) => !progressMap[pattern.id]?.mastered) ?? orderedPatterns[0];

  return {
    continuePattern,
    recommendedPattern,
    orderedPatterns,
  };
}
