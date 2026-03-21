import type { Question, GameMode } from '../../../types/question';
import type { Word } from '../../../types/word';
import { buildLetterPool } from '../utils/buildLetterPool';
import { buildChoiceOptions } from '../utils/buildChoiceOptions';
import { buildBlankPattern } from '../utils/buildBlankPattern';

export function generateQuestion(word: Word, mode: GameMode, bank: Word[]): Question {
  const id = `${mode}-${word.id}`;

  if (mode === 'e2c') {
    return {
      id,
      mode,
      wordId: word.id,
      prompt: word.english,
      options: buildChoiceOptions(word, bank),
      answer: word.chinese,
    };
  }

  if (mode === 'spell_blank') {
    const { pattern, missingIndexes } = buildBlankPattern(word.english);
    const missingLetters = missingIndexes.map((index) => word.english[index]).join('');
    return {
      id,
      mode,
      wordId: word.id,
      prompt: word.chinese,
      pattern,
      missingIndexes,
      letterPool: buildLetterPool(missingLetters, 8),
      answer: word.english,
    };
  }

  return {
    id,
    mode: 'c2e',
    wordId: word.id,
    prompt: word.chinese,
    letterPool: buildLetterPool(word.english, 10),
    answer: word.english,
  };
}
