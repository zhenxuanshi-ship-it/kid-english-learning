import { describe, expect, it } from 'vitest';
import { findWordByEnglish, hasWordEnglishMatch } from './wordLookup';

describe('wordLookup', () => {
  it('matches canonical english forms', () => {
    expect(findWordByEnglish('watermelon')?.english).toBe('watermelon');
  });

  it('matches alias forms to canonical entries', () => {
    expect(findWordByEnglish('grapes')?.english).toBe('grape');
    expect(findWordByEnglish('ice cream')?.english).toBe('icecream');
    expect(findWordByEnglish('shoes')?.english).toBe('shoe');
  });

  it('normalizes spacing and casing', () => {
    expect(hasWordEnglishMatch('  ICE   CREAM  ')).toBe(true);
  });
});
