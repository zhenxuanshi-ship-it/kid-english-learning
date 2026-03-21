import { create } from 'zustand';
import { createSentenceRound } from '../lib/sentencePractice';
import type { SentenceExercise, SentencePatternId } from '../types/sentence';
import { useSentenceProgressStore } from './sentenceProgressStore';

interface SentenceGameState {
  currentPatternId?: SentencePatternId;
  round: SentenceExercise[];
  roundIndex: number;
  currentExercise: SentenceExercise | null;
  selectedAnswer?: string;
  arrangedTokens: string[];
  isCorrect?: boolean;
  completed: boolean;
  startRound: (patternId: SentencePatternId) => void;
  selectAnswer: (answer: string) => void;
  arrangeTokens: (tokens: string[]) => void;
  undoArrangeToken: () => void;
  nextExercise: () => void;
  reset: () => void;
}

const initialState = {
  currentPatternId: undefined,
  round: [],
  roundIndex: 0,
  currentExercise: null,
  selectedAnswer: undefined,
  arrangedTokens: [],
  isCorrect: undefined,
  completed: false,
};

export const useSentenceGameStore = create<SentenceGameState>((set, get) => ({
  ...initialState,
  startRound: (patternId) => {
    const round = createSentenceRound(patternId);
    useSentenceProgressStore.getState().recordSeen(patternId);
    set({
      ...initialState,
      currentPatternId: patternId,
      round,
      currentExercise: round[0] ?? null,
    });
  },
  selectAnswer: (answer) => {
    const state = get();
    if (!state.currentExercise || Array.isArray(state.currentExercise.answer)) return;
    const isCorrect = state.currentExercise.answer === answer;
    if (state.currentPatternId) {
      useSentenceProgressStore.getState().recordResult(state.currentPatternId, isCorrect);
    }
    set({ selectedAnswer: answer, isCorrect });
  },
  arrangeTokens: (tokens) => {
    const state = get();
    if (!state.currentExercise || !Array.isArray(state.currentExercise.answer)) return;
    const isCorrect = JSON.stringify(tokens) === JSON.stringify(state.currentExercise.answer);
    if (state.currentPatternId && tokens.length === state.currentExercise.answer.length) {
      useSentenceProgressStore.getState().recordResult(state.currentPatternId, isCorrect);
    }
    set({ arrangedTokens: tokens, isCorrect: tokens.length === state.currentExercise.answer.length ? isCorrect : undefined });
  },
  undoArrangeToken: () => {
    const state = get();
    if (!state.currentExercise || !Array.isArray(state.currentExercise.answer) || state.arrangedTokens.length === 0 || typeof state.isCorrect === 'boolean') return;
    set({ arrangedTokens: state.arrangedTokens.slice(0, -1), isCorrect: undefined });
  },
  nextExercise: () => {
    const state = get();
    const nextIndex = state.roundIndex + 1;
    if (nextIndex >= state.round.length) {
      set({ roundIndex: nextIndex, currentExercise: null, completed: true, selectedAnswer: undefined, arrangedTokens: [], isCorrect: undefined });
      return;
    }
    set({
      roundIndex: nextIndex,
      currentExercise: state.round[nextIndex],
      selectedAnswer: undefined,
      arrangedTokens: [],
      isCorrect: undefined,
    });
  },
  reset: () => set({ ...initialState }),
}));
