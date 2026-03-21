import { describe, expect, it } from 'vitest';
import { allWords } from '../../../data/words';
import { generateQuestion } from './questionGenerator';

describe('generateQuestion', () => {
  it('generates e2c question with 4 options', () => {
    const word = allWords.find((item) => item.english === 'apple')!;
    const question = generateQuestion(word, 'e2c', allWords);
    expect(question.mode).toBe('e2c');
    if (question.mode !== 'e2c') throw new Error('Expected e2c question');
    expect(question.answer).toBe('苹果');
    expect(question.options).toHaveLength(4);
  });

  it('generates c2e question with letter pool containing answer letters', () => {
    const word = allWords.find((item) => item.english === 'cat')!;
    const question = generateQuestion(word, 'c2e', allWords);
    expect(question.mode).toBe('c2e');
    if (question.mode !== 'c2e') throw new Error('Expected c2e question');
    expect(question.answer).toBe('cat');
    expect(question.letterPool).toEqual(expect.arrayContaining(['c', 'a', 't']));
  });

  it('generates spell_blank question with pattern and missing indexes', () => {
    const word = allWords.find((item) => item.english === 'apple')!;
    const question = generateQuestion(word, 'spell_blank', allWords);
    expect(question.mode).toBe('spell_blank');
    if (question.mode !== 'spell_blank') throw new Error('Expected spell_blank question');
    expect(question.pattern[0]).toBe('a');
    expect(question.missingIndexes.length).toBe(2);
  });
});
