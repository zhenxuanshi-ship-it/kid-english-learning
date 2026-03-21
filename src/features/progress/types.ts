import type { GameMode } from '../../types/question';

export type LearningStage = 'new' | 'learning' | 'practicing' | 'review' | 'mastered';

export interface WordProgress {
  wordId: number;
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  mastered: boolean;
  learningStage: LearningStage;
  seenLearningCard?: boolean;
  lastMode?: GameMode;
  lastResult?: 'correct' | 'wrong';
  lastReviewedAt?: number;
}

export interface UserProgress {
  totalStars: number;
  currentMode: GameMode;
  learnedWordIds: number[];
  wordProgressMap: Record<number, WordProgress>;
  lastStudyDate?: string;
}
