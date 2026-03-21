import { sentenceExercises, sentencePatterns } from '../data/sentences';
import type { SentenceExercise, SentencePattern, SentencePatternId } from '../types/sentence';

export function getSentencePattern(patternId: SentencePatternId): SentencePattern | undefined {
  return sentencePatterns.find((pattern) => pattern.id === patternId);
}

export function getSentenceExercises(patternId: SentencePatternId): SentenceExercise[] {
  return sentenceExercises.filter((exercise) => exercise.patternId === patternId);
}

export function createSentenceRound(patternId: SentencePatternId, roundSize = 3): SentenceExercise[] {
  return getSentenceExercises(patternId).slice(0, roundSize);
}
