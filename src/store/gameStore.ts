import { create } from 'zustand';
import { allWords } from '../data/words';
import { generateQuestion } from '../features/game/engine/questionGenerator';
import { createRound } from '../features/game/engine/roundEngine';
import { isSpellingCorrect } from '../features/game/engine/validators';
import type { GameState } from '../types/game';
import type { GameMode } from '../types/question';
import { useProgressStore } from './progressStore';

interface GameStore extends GameState {
  startRound: (mode?: GameMode, wordIds?: number[]) => void;
  inputLetter: (letter: string) => void;
  removeLastLetter: () => void;
  selectOption: (option: string) => void;
  showCorrectAnswer: () => void;
  nextQuestion: () => void;
  resetRound: () => void;
}

const initialState: GameState = {
  mode: 'e2c',
  currentWord: null,
  currentQuestion: null,
  userInput: '',
  selectedOption: undefined,
  stars: 0,
  comboCount: 0,
  attemptCount: 0,
  showAnswer: false,
  result: null,
  roundIndex: 0,
  roundTotal: 5,
  roundWordIds: [],
  wrongWordIds: [],
  completedWordIds: [],
};

function buildQuestion(mode: GameMode, wordId: number) {
  const word = allWords.find((item) => item.id === wordId) ?? null;
  return word
    ? { word, question: generateQuestion(word, mode, allWords) }
    : { word: null, question: null };
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  startRound: (mode, wordIds) => {
    const selectedMode = mode ?? useProgressStore.getState().currentMode;
    const roundWordIds = wordIds ?? createRound(allWords, 5);
    const firstWordId = roundWordIds[0];
    const { word, question } = buildQuestion(selectedMode, firstWordId);
    if (!word || !question) return;

    useProgressStore.getState().setMode(selectedMode);
    useProgressStore.getState().recordSeen(word.id);

    set({
      ...initialState,
      mode: selectedMode,
      roundWordIds,
      roundTotal: roundWordIds.length,
      currentWord: word,
      currentQuestion: question,
    });
  },
  inputLetter: (letter) => {
    const state = get();
    if (!state.currentQuestion || state.result) return;
    const nextInput = state.userInput + letter.toLowerCase();
    const targetLength = state.currentQuestion.mode === 'spell_blank'
      ? state.currentQuestion.missingIndexes.length
      : state.currentQuestion.answer.length;

    if (nextInput.length > targetLength) return;

    if (state.currentQuestion.mode === 'spell_blank') {
      const filled = [...state.currentQuestion.pattern];
      state.currentQuestion.missingIndexes.forEach((index, idx) => {
        filled[index] = nextInput[idx] ?? '';
      });
      const fullWord = filled.join('');
      const shouldCheck = nextInput.length === state.currentQuestion.missingIndexes.length;
      set({ userInput: nextInput });
      if (shouldCheck) {
        const correct = isSpellingCorrect(fullWord, state.currentQuestion.answer);
        useProgressStore.getState().recordResult(state.currentQuestion.wordId, correct);
        if (correct) useProgressStore.getState().addStars(1);
        set({
          result: correct ? 'correct' : 'wrong',
          stars: state.stars + (correct ? 1 : 0),
          comboCount: correct ? state.comboCount + 1 : 0,
          attemptCount: state.attemptCount + 1,
          wrongWordIds: correct ? state.wrongWordIds : Array.from(new Set([...state.wrongWordIds, state.currentQuestion.wordId])),
        });
      }
      return;
    }

    set({ userInput: nextInput });
    if (nextInput.length === state.currentQuestion.answer.length) {
      const correct = isSpellingCorrect(nextInput, state.currentQuestion.answer);
      useProgressStore.getState().recordResult(state.currentQuestion.wordId, correct);
      if (correct) useProgressStore.getState().addStars(1);
      set({
        result: correct ? 'correct' : 'wrong',
        stars: state.stars + (correct ? 1 : 0),
        comboCount: correct ? state.comboCount + 1 : 0,
        attemptCount: state.attemptCount + 1,
        wrongWordIds: correct ? state.wrongWordIds : Array.from(new Set([...state.wrongWordIds, state.currentQuestion.wordId])),
      });
    }
  },
  removeLastLetter: () => {
    const state = get();
    if (state.result) return;
    set({ userInput: state.userInput.slice(0, -1) });
  },
  selectOption: (option) => {
    const state = get();
    if (!state.currentQuestion || state.currentQuestion.mode !== 'e2c' || state.result) return;
    const correct = option === state.currentQuestion.answer;
    useProgressStore.getState().recordResult(state.currentQuestion.wordId, correct);
    if (correct) useProgressStore.getState().addStars(1);
    set({
      selectedOption: option,
      result: correct ? 'correct' : 'wrong',
      stars: state.stars + (correct ? 1 : 0),
      comboCount: correct ? state.comboCount + 1 : 0,
      attemptCount: state.attemptCount + 1,
      wrongWordIds: correct ? state.wrongWordIds : Array.from(new Set([...state.wrongWordIds, state.currentQuestion.wordId])),
    });
  },
  showCorrectAnswer: () => {
    const state = get();
    set({ showAnswer: true, comboCount: 0, result: state.result ?? 'wrong' });
    if (state.currentQuestion) {
      useProgressStore.getState().recordResult(state.currentQuestion.wordId, false);
    }
  },
  nextQuestion: () => {
    const state = get();
    const nextIndex = state.roundIndex + 1;
    const completedWordIds = state.currentWord
      ? [...state.completedWordIds, state.currentWord.id]
      : state.completedWordIds;

    if (nextIndex >= state.roundWordIds.length) {
      set({ roundIndex: nextIndex, completedWordIds, currentQuestion: null, currentWord: null });
      return;
    }

    const nextWordId = state.roundWordIds[nextIndex];
    const { word, question } = buildQuestion(state.mode, nextWordId);
    if (!word || !question) return;
    useProgressStore.getState().recordSeen(word.id);
    set({
      currentWord: word,
      currentQuestion: question,
      roundIndex: nextIndex,
      userInput: '',
      selectedOption: undefined,
      showAnswer: false,
      result: null,
      attemptCount: 0,
      completedWordIds,
    });
  },
  resetRound: () => set({ ...initialState }),
}));
