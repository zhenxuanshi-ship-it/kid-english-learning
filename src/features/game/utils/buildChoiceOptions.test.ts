import { describe, expect, it } from 'vitest';
import { allWords } from '../../../data/words';
import { buildChoiceOptions } from './buildChoiceOptions';

describe('buildChoiceOptions', () => {
  it('returns 4 options including the correct chinese answer', () => {
    const word = allWords.find((item) => item.english === 'apple');
    expect(word).toBeTruthy();
    const options = buildChoiceOptions(word!, allWords);
    expect(options).toHaveLength(4);
    expect(options).toContain('苹果');
  });

  it('does not duplicate the correct answer', () => {
    const word = allWords.find((item) => item.english === 'dog');
    expect(word).toBeTruthy();
    const options = buildChoiceOptions(word!, allWords);
    expect(options.filter((item) => item === word!.chinese)).toHaveLength(1);
  });
});
