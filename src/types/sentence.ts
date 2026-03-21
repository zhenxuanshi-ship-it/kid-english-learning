export type SentencePatternId = 'this_is' | 'i_like';
export type SentenceExerciseMode = 'choose_word' | 'match_sentence' | 'reorder_words';

export interface SentencePattern {
  id: SentencePatternId;
  title: string;
  description: string;
  examples: string[];
}

export interface SentenceExercise {
  id: string;
  patternId: SentencePatternId;
  mode: SentenceExerciseMode;
  english: string;
  chinese: string;
  answer: string | string[];
  prompt?: string;
  options?: string[];
  tokens?: string[];
  imageWordId?: number;
}

export interface SentenceProgress {
  patternId: SentencePatternId;
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  mastered: boolean;
  lastPracticedAt?: number;
}
