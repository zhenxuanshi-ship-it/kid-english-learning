import { create } from 'zustand';
import { readJson, writeJson } from '../lib/storage';
import type { UserProgress } from '../features/progress/types';
import type { GameMode } from '../types/question';

const STORAGE_KEY = 'kids-english-progress';

const initialProgress: UserProgress = {
  totalStars: 0,
  currentMode: 'e2c',
  learnedWordIds: [],
  wordProgressMap: {},
};

interface ProgressStore extends UserProgress {
  addStars: (count: number) => void;
  setMode: (mode: GameMode) => void;
  recordSeen: (wordId: number) => void;
  recordResult: (wordId: number, isCorrect: boolean) => void;
  hydrate: () => void;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  ...initialProgress,
  addStars: (count) => {
    const next = { ...get(), totalStars: get().totalStars + count };
    set({ totalStars: next.totalStars });
    writeJson(STORAGE_KEY, {
      totalStars: next.totalStars,
      currentMode: get().currentMode,
      learnedWordIds: get().learnedWordIds,
      wordProgressMap: get().wordProgressMap,
      lastStudyDate: get().lastStudyDate,
    });
  },
  setMode: (mode) => {
    set({ currentMode: mode });
    writeJson(STORAGE_KEY, {
      totalStars: get().totalStars,
      currentMode: mode,
      learnedWordIds: get().learnedWordIds,
      wordProgressMap: get().wordProgressMap,
      lastStudyDate: get().lastStudyDate,
    });
  },
  recordSeen: (wordId) => {
    const current = get().wordProgressMap[wordId] ?? {
      wordId,
      seenCount: 0,
      correctCount: 0,
      wrongCount: 0,
      mastered: false,
    };
    const wordProgressMap = {
      ...get().wordProgressMap,
      [wordId]: {
        ...current,
        seenCount: current.seenCount + 1,
        lastReviewedAt: Date.now(),
      },
    };
    const learnedWordIds = Array.from(new Set([...get().learnedWordIds, wordId]));
    set({ wordProgressMap, learnedWordIds, lastStudyDate: new Date().toISOString() });
    writeJson(STORAGE_KEY, {
      totalStars: get().totalStars,
      currentMode: get().currentMode,
      learnedWordIds,
      wordProgressMap,
      lastStudyDate: new Date().toISOString(),
    });
  },
  recordResult: (wordId, isCorrect) => {
    const current = get().wordProgressMap[wordId] ?? {
      wordId,
      seenCount: 0,
      correctCount: 0,
      wrongCount: 0,
      mastered: false,
    };
    const correctCount = current.correctCount + (isCorrect ? 1 : 0);
    const wrongCount = current.wrongCount + (isCorrect ? 0 : 1);
    const wordProgressMap = {
      ...get().wordProgressMap,
      [wordId]: {
        ...current,
        correctCount,
        wrongCount,
        mastered: correctCount >= 3 && wrongCount <= 1,
        lastReviewedAt: Date.now(),
      },
    };
    set({ wordProgressMap });
    writeJson(STORAGE_KEY, {
      totalStars: get().totalStars,
      currentMode: get().currentMode,
      learnedWordIds: get().learnedWordIds,
      wordProgressMap,
      lastStudyDate: get().lastStudyDate,
    });
  },
  hydrate: () => {
    const data = readJson<UserProgress>(STORAGE_KEY, initialProgress);
    set({ ...data });
  },
}));
