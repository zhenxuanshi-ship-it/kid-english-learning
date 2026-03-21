import type { GameMode } from '../../types/question';

export interface WordProgress {
  wordId: number;
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  mastered: boolean;
  lastReviewedAt?: number;
}

export interface UserProgress {
  totalStars: number;
  currentMode: GameMode;
  learnedWordIds: number[];
  wordProgressMap: Record<number, WordProgress>;
  lastStudyDate?: string;
}
