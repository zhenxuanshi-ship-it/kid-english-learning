import { describe, expect, it } from 'vitest';
import { allWords } from './index';

describe('word resources', () => {
  it('provides an emoji resource for every word', () => {
    expect(allWords.every((word) => Boolean(word.emoji))).toBe(true);
  });

  it('includes a growing sample set of real image-backed words', () => {
    expect(allWords.filter((word) => Boolean(word.imageUrl)).length).toBeGreaterThanOrEqual(30);
  });

  it('includes newly imported step-1 words from the Y2 plan', () => {
    const importedWords = ['zebra', 'watermelon', 'crayon', 'classroom', 'umbrella', 'puddle'];
    expect(importedWords.every((english) => allWords.some((word) => word.english === english))).toBe(true);
  });

  it('includes newly imported missing step-2 words from the Y2 plan', () => {
    const importedWords = ['burger', 'sticker'];
    expect(importedWords.every((english) => allWords.some((word) => word.english === english))).toBe(true);
  });

  it('continues importing remaining safe Y2 words into the word bank', () => {
    const importedWords = ['paper', 'scissors', 'card', 'pizza', 'jacket', 'raincoat'];
    expect(importedWords.every((english) => allWords.some((word) => word.english === english))).toBe(true);
  });

  it('absorbs remaining Y2 plural or spacing variants as aliases without duplicating the core bank', () => {
    expect(allWords.find((word) => word.english === 'grape')?.sourceAliases).toContain('grapes');
    expect(allWords.find((word) => word.english === 'eye')?.sourceAliases).toContain('eyes');
    expect(allWords.find((word) => word.english === 'hand')?.sourceAliases).toContain('hands');
    expect(allWords.find((word) => word.english === 'foot')?.sourceAliases).toContain('feet');
    expect(allWords.find((word) => word.english === 'ear')?.sourceAliases).toContain('ears');
    expect(allWords.find((word) => word.english === 'noodle')?.sourceAliases).toContain('noodles');
    expect(allWords.find((word) => word.english === 'icecream')?.sourceAliases).toContain('ice cream');
    expect(allWords.find((word) => word.english === 'shoe')?.sourceAliases).toContain('shoes');
    expect(allWords.find((word) => word.english === 'sock')?.sourceAliases).toContain('socks');
    expect(allWords.find((word) => word.english === 'burger')?.sourceAliases).toContain('burgers');
  });
});
