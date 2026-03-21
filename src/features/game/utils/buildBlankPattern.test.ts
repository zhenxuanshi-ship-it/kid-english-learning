import { describe, expect, it } from 'vitest';
import { buildBlankPattern } from './buildBlankPattern';

describe('buildBlankPattern', () => {
  it('leaves 1 blank for 3-4 letter words and keeps first letter', () => {
    const result = buildBlankPattern('cat');
    expect(result.missingIndexes).toHaveLength(1);
    expect(result.missingIndexes[0]).toBeGreaterThan(0);
    expect(result.pattern[0]).toBe('c');
  });

  it('leaves 2 blanks for 5-6 letter words', () => {
    const result = buildBlankPattern('apple');
    expect(result.missingIndexes).toHaveLength(2);
    expect(result.pattern[0]).toBe('a');
  });

  it('leaves 3 blanks for 7+ letter words', () => {
    const result = buildBlankPattern('brother');
    expect(result.missingIndexes).toHaveLength(3);
    expect(result.pattern[0]).toBe('b');
  });
});
