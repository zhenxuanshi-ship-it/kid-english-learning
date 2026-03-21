import { create } from 'zustand';
import { readJson, writeJson } from '../lib/storage';
import type { UserProgress, WordProgress } from '../features/progress/types';
import type { GameMode } from '../types/question';
import { getInitialLearningStage, getNextLearningStage } from '../features/game/engine/learningRules';

const STORAGE_KEY = 'kids-english-progress';

const initialProgress: UserProgress = {
  totalStars: 0,
  currentMode: 'e2c',
  learnedWordIds: [],
  wordProgressMap: {},
};

function createDefaultWordProgress(wordId: number): WordProgress {
  return {
    wordId,
    seenCount: 0,
    correctCount: 0,
    wrongCount: 0,
    mastered: false,
    learningStage: getInitialLearningStage(),
    seenLearningCard: false,
  };
}

function normalizeWordProgressMap(map: Record<number, WordProgress>): Record<number, WordProgress> {
  return Object.fromEntries(
    Object.entries(map).map(([key, value]) => {
      const base = createDefaultWordProgress(Number(key));
      return [
        key,
        {
          ...base,
          ...value,
          learningStage: value.learningStage ?? (value.mastered ? 'mastered' : value.seenCount > 0 ? 'learning' : 'new'),
        },
      ];
    }),
  );
}

interface ProgressStore extends UserProgress {
  addStars: (count: number) => void;
  setMode: (mode: GameMode) => void;
  recordSeen: (wordId: number) => void;
  recordResult: (wordId: number, isCorrect: boolean, mode?: GameMode) => void;
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
    const current = get().wordProgressMap[wordId] ?? createDefaultWordProgress(wordId);
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
  recordResult: (wordId, isCorrect, mode) => {
    const current = get().wordProgressMap[wordId] ?? createDefaultWordProgress(wordId);
    const correctCount = current.correctCount + (isCorrect ? 1 : 0);
    const wrongCount = current.wrongCount + (isCorrect ? 0 : 1);
    const nextProgress: WordProgress = {
      ...current,
      correctCount,
      wrongCount,
      mastered: correctCount >= 3 && wrongCount <= 1,
      learningStage: getNextLearningStage(current, isCorrect),
      lastMode: mode,
      lastResult: isCorrect ? 'correct' : 'wrong',
      lastReviewedAt: Date.now(),
    };
    if (nextProgress.mastered) {
      nextProgress.learningStage = 'mastered';
    }
    const wordProgressMap = {
      ...get().wordProgressMap,
      [wordId]: nextProgress,
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
    set({
      ...data,
      wordProgressMap: normalizeWordProgressMap(data.wordProgressMap ?? {}),
    });
  },
}));
