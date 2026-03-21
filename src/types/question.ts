export type GameMode = 'c2e' | 'e2c' | 'spell_blank';

export interface BaseQuestion {
  id: string;
  mode: GameMode;
  wordId: number;
  answer: string;
}

export interface C2EQuestion extends BaseQuestion {
  mode: 'c2e';
  prompt: string;
  letterPool: string[];
}

export interface E2CQuestion extends BaseQuestion {
  mode: 'e2c';
  prompt: string;
  options: string[];
}

export interface SpellBlankQuestion extends BaseQuestion {
  mode: 'spell_blank';
  prompt: string;
  pattern: string[];
  missingIndexes: number[];
  letterPool: string[];
}

export type Question = C2EQuestion | E2CQuestion | SpellBlankQuestion;
