import { describe, expect, it, vi, beforeEach } from 'vitest';
import { speakWord, playSuccessTone, playErrorTone } from './audio';

describe('audio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('speakWord', () => {
    it('does nothing when enabled is false', () => {
      // Should not throw
      expect(() => speakWord('hello', false)).not.toThrow();
    });

    it('does nothing when text is empty', () => {
      expect(() => speakWord('', true)).not.toThrow();
    });

    it('does not throw when called with enabled=true and text', () => {
      // speechSynthesis may not exist in jsdom — function should handle gracefully
      expect(() => speakWord('apple', true)).not.toThrow();
    });

    it('does not throw with custom rate', () => {
      expect(() => speakWord('banana', true, 0.8)).not.toThrow();
    });
  });

  describe('playSuccessTone', () => {
    it('does not throw when enabled is false', () => {
      expect(() => playSuccessTone(false)).not.toThrow();
    });

    it('does not throw when enabled is true', () => {
      expect(() => playSuccessTone(true)).not.toThrow();
    });
  });

  describe('playErrorTone', () => {
    it('does not throw when enabled is false', () => {
      expect(() => playErrorTone(false)).not.toThrow();
    });

    it('does not throw when enabled is true', () => {
      expect(() => playErrorTone(true)).not.toThrow();
    });
  });
});
