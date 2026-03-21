import { describe, expect, it } from 'vitest';
import { buildLetterPool } from './buildLetterPool';

describe('buildLetterPool', () => {
  it('contains all answer letters', () => {
    const pool = buildLetterPool('cat', 8);
    expect(pool).toEqual(expect.arrayContaining(['c', 'a', 't']));
    expect(pool.length).toBe(8);
  });

  it('keeps repeated letters', () => {
    const pool = buildLetterPool('apple', 8);
    const pCount = pool.filter((letter) => letter === 'p').length;
    expect(pCount).toBeGreaterThanOrEqual(2);
  });

  it('never returns fewer letters than answer length', () => {
    const pool = buildLetterPool('brother', 5);
    expect(pool.length).toBeGreaterThanOrEqual('brother'.length);
  });
});
