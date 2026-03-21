import { create } from 'zustand';
import { readJson, writeJson } from '../lib/storage';
import type { SentencePatternId, SentenceProgress } from '../types/sentence';

const STORAGE_KEY = 'kids-english-sentence-progress';

interface SentenceProgressState {
  progressMap: Partial<Record<SentencePatternId, SentenceProgress>>;
  hydrate: () => void;
  recordSeen: (patternId: SentencePatternId) => void;
  recordResult: (patternId: SentencePatternId, isCorrect: boolean) => void;
}

function createDefaultProgress(patternId: SentencePatternId): SentenceProgress {
  return {
    patternId,
    seenCount: 0,
    correctCount: 0,
    wrongCount: 0,
    mastered: false,
  };
}

export const useSentenceProgressStore = create<SentenceProgressState>((set, get) => ({
  progressMap: {} as Record<SentencePatternId, SentenceProgress>,
  hydrate: () => {
    const progressMap = readJson<Record<SentencePatternId, SentenceProgress>>(STORAGE_KEY, {} as Record<SentencePatternId, SentenceProgress>);
    set({ progressMap });
  },
  recordSeen: (patternId) => {
    const current = get().progressMap[patternId] ?? createDefaultProgress(patternId);
    const progressMap = {
      ...get().progressMap,
      [patternId]: {
        ...current,
        seenCount: current.seenCount + 1,
        lastPracticedAt: Date.now(),
      },
    };
    set({ progressMap });
    writeJson(STORAGE_KEY, progressMap);
  },
  recordResult: (patternId, isCorrect) => {
    const current = get().progressMap[patternId] ?? createDefaultProgress(patternId);
    const next: SentenceProgress = {
      ...current,
      correctCount: current.correctCount + (isCorrect ? 1 : 0),
      wrongCount: current.wrongCount + (isCorrect ? 0 : 1),
      mastered: current.correctCount + (isCorrect ? 1 : 0) >= 3,
      lastPracticedAt: Date.now(),
    };
    const progressMap = { ...get().progressMap, [patternId]: next };
    set({ progressMap });
    writeJson(STORAGE_KEY, progressMap);
  },
}));
