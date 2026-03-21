import { describe, expect, it } from 'vitest';
import { getSentencePatternIdsForCategory } from './sentenceCategoryLink';

describe('sentenceCategoryLink', () => {
  it('maps animals to introductory sentence patterns', () => {
    expect(getSentencePatternIdsForCategory('animals')).toEqual(['this_is', 'what_is_this']);
  });

  it('returns empty for all category', () => {
    expect(getSentencePatternIdsForCategory('all')).toEqual([]);
  });
});
