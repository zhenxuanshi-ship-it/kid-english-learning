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

function buildOrderedPatterns(
  progressMap: Partial<Record<SentencePatternId, SentenceProgress>>,
  preferredPatternIds: SentencePatternId[] = [],
): SentencePattern[] {
  const preferredSet = new Set(preferredPatternIds);
  return [...sentencePatterns].sort((a, b) => {
    const progressA = progressMap[a.id];
    const progressB = progressMap[b.id];
    const preferredDiff = Number(preferredSet.has(b.id)) - Number(preferredSet.has(a.id));
    if (preferredDiff !== 0) return preferredDiff;
    const scoreDiff = getPriorityScore(progressB) - getPriorityScore(progressA);
    if (scoreDiff !== 0) return scoreDiff;
    const lastA = progressA?.lastPracticedAt ?? 0;
    const lastB = progressB?.lastPracticedAt ?? 0;
    return lastB - lastA;
  });
}

function getContinuePattern(progressMap: Partial<Record<SentencePatternId, SentenceProgress>>): SentencePattern | undefined {
  return [...sentencePatterns]
    .filter((pattern) => {
      const progress = progressMap[pattern.id];
      return progress && !progress.mastered && progress.seenCount > 0;
    })
    .sort((a, b) => (progressMap[b.id]?.lastPracticedAt ?? 0) - (progressMap[a.id]?.lastPracticedAt ?? 0))[0];
}

function getFirstUnmastered(
  orderedPatterns: SentencePattern[],
  progressMap: Partial<Record<SentencePatternId, SentenceProgress>>,
): SentencePattern | undefined {
  return orderedPatterns.find((pattern) => !progressMap[pattern.id]?.mastered) ?? orderedPatterns[0];
}

export function getSentenceRecommendation(
  progressMap: Partial<Record<SentencePatternId, SentenceProgress>>,
  preferredPatternIds: SentencePatternId[] = [],
): SentenceRecommendation {
  const orderedPatterns = buildOrderedPatterns(progressMap, preferredPatternIds);
  const continuePattern = getContinuePattern(progressMap);
  const recommendedPattern = getFirstUnmastered(orderedPatterns, progressMap);

  return {
    continuePattern,
    recommendedPattern,
    orderedPatterns,
  };
}

export function getHomeSentenceSpotlight(
  progressMap: Partial<Record<SentencePatternId, SentenceProgress>>,
  preferredPatternIds: SentencePatternId[] = [],
): SentencePattern | undefined {
  return getContinuePattern(progressMap) ?? getFirstUnmastered(buildOrderedPatterns(progressMap, preferredPatternIds), progressMap);
}

export function getTopicSentenceSpotlight(
  progressMap: Partial<Record<SentencePatternId, SentenceProgress>>,
  preferredPatternIds: SentencePatternId[] = [],
): SentencePattern | undefined {
  const ordered = buildOrderedPatterns(progressMap, preferredPatternIds);
  const preferredUnmastered = ordered.find(
    (pattern) => preferredPatternIds.includes(pattern.id) && !progressMap[pattern.id]?.mastered,
  );
  return preferredUnmastered ?? getFirstUnmastered(ordered, progressMap);
}

export function getSummarySentenceSpotlight(
  progressMap: Partial<Record<SentencePatternId, SentenceProgress>>,
  preferredPatternIds: SentencePatternId[] = [],
): SentencePattern | undefined {
  const ordered = buildOrderedPatterns(progressMap, preferredPatternIds);
  const freshLinkedPattern = ordered.find((pattern) => preferredPatternIds.includes(pattern.id));
  return freshLinkedPattern ?? getFirstUnmastered(ordered, progressMap);
}
