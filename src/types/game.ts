import type { Question, GameMode } from './question';
import type { Word } from './word';

export interface RoundResult {
  correctCount: number;
  earnedStars: number;
  wrongWordIds: number[];
}

export interface GameState {
  mode: GameMode;
  currentWord: Word | null;
  currentQuestion: Question | null;
  userInput: string;
  selectedOption?: string;
  stars: number;
  comboCount: number;
  attemptCount: number;
  showAnswer: boolean;
  result: 'correct' | 'wrong' | null;
  roundIndex: number;
  roundTotal: number;
  roundWordIds: number[];
  wrongWordIds: number[];
  completedWordIds: number[];
}
