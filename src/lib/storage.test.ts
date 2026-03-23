import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockGetItem = vi.fn();
const mockSetItem = vi.fn();

Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: mockGetItem,
    setItem: mockSetItem,
  },
  writable: true,
});

describe('storage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('readJson', async () => {
    it('returns fallback when key not found', async () => {
      mockGetItem.mockReturnValue(null);
      const { readJson } = await import('./storage');
      expect(readJson('nonexistent', { default: true })).toEqual({ default: true });
    });

    it('returns parsed data when key exists', async () => {
      mockGetItem.mockReturnValue('{"name":"test"}');
      const { readJson } = await import('./storage');
      expect(readJson('test-key', null)).toEqual({ name: 'test' });
    });

    it('returns fallback on invalid JSON', async () => {
      mockGetItem.mockReturnValue('not json');
      const { readJson } = await import('./storage');
      expect(readJson('bad-key', { fallback: true })).toEqual({ fallback: true });
    });
  });

  describe('writeJson', async () => {
    it('writes stringified JSON to localStorage', async () => {
      const { writeJson } = await import('./storage');
      writeJson('my-key', { foo: 'bar' });
      expect(mockSetItem).toHaveBeenCalledWith('my-key', JSON.stringify({ foo: 'bar' }));
    });

    it('writes arrays correctly', async () => {
      const { writeJson } = await import('./storage');
      writeJson('list-key', [1, 2, 3]);
      expect(mockSetItem).toHaveBeenCalledWith('list-key', '[1,2,3]');
    });

    it('writes primitives', async () => {
      const { writeJson } = await import('./storage');
      writeJson('num-key', 42);
      expect(mockSetItem).toHaveBeenCalledWith('num-key', '42');
    });
  });
});
