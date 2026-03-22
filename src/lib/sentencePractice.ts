import { sentenceExercises, sentencePatterns } from '../data/sentences';
import type { SentenceExercise, SentencePattern, SentencePatternId } from '../types/sentence';
import type { Word } from '../types/word';
import { findWordByEnglish } from './wordLookup';

export function getSentencePattern(patternId: SentencePatternId): SentencePattern | undefined {
  return sentencePatterns.find((pattern) => pattern.id === patternId);
}

export function getSentenceExercises(patternId: SentencePatternId): SentenceExercise[] {
  return sentenceExercises.filter((exercise) => exercise.patternId === patternId);
}

export function createSentenceRound(patternId: SentencePatternId, roundSize = 3): SentenceExercise[] {
  return getSentenceExercises(patternId).slice(0, roundSize);
}

export function extractSentenceKeywords(exercise: SentenceExercise): string[] {
  const candidates = new Set<string>();
  const collect = (text: string) => {
    text
      .toLowerCase()
      .replace(/[^a-z\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .forEach((token) => candidates.add(token));
  };

  collect(exercise.english);

  if (typeof exercise.answer === 'string') {
    collect(exercise.answer);
  }

  if (Array.isArray(exercise.answer)) {
    exercise.answer.forEach((token) => collect(token));
  }

  exercise.options?.forEach((option) => collect(option));

  return [...candidates];
}

export function getSentenceLinkedWords(exercise: SentenceExercise): Word[] {
  return extractSentenceKeywords(exercise)
    .map((token) => findWordByEnglish(token))
    .filter((word): word is Word => Boolean(word));
}
