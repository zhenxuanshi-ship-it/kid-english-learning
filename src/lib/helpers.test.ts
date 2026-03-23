import { describe, expect, it, vi } from 'vitest';
import { shuffle, sample } from './helpers';

describe('helpers', () => {
  describe('shuffle', () => {
    it('returns array of same length', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);
      expect(result).toHaveLength(5);
    });

    it('contains all original items', () => {
      const input = ['a', 'b', 'c'];
      const result = shuffle(input);
      expect(result.sort()).toEqual(['a', 'b', 'c']);
    });

    it('does not mutate original array', () => {
      const input = [1, 2, 3];
      shuffle([...input]);
      expect(input).toEqual([1, 2, 3]);
    });

    it('handles empty array', () => {
      expect(shuffle([])).toEqual([]);
    });

    it('handles single item', () => {
      expect(shuffle(['only'])).toEqual(['only']);
    });
  });

  describe('sample', () => {
    it('returns correct count of items', () => {
      const input = [1, 2, 3, 4, 5];
      const result = sample(input, 3);
      expect(result).toHaveLength(3);
    });

    it('returns all items when count equals length', () => {
      const input = [1, 2, 3];
      const result = sample(input, 3);
      expect(result.sort()).toEqual([1, 2, 3]);
    });

    it('returns empty array when count is 0', () => {
      expect(sample([1, 2, 3], 0)).toEqual([]);
    });

    it('handles count greater than array length', () => {
      const input = [1, 2];
      const result = sample(input, 5);
      expect(result).toHaveLength(2);
    });

    it('handles empty array', () => {
      expect(sample([], 3)).toEqual([]);
    });
  });
});
