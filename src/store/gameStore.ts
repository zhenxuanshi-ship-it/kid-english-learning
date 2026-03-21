import { create } from 'zustand';
import { allWords } from '../data/words';
import { generateQuestion } from '../features/game/engine/questionGenerator';
import { createPriorityRound } from '../features/game/engine/roundEngine';
import { isSpellingCorrect } from '../features/game/engine/validators';
import type { GameState } from '../types/game';
import type { GameMode } from '../types/question';
import { useProgressStore } from './progressStore';
import { useSettingsStore } from './settingsStore';

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
  feedbackMessage: undefined,
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
    const settings = useSettingsStore.getState();
    const roundWordIds = wordIds ?? createPriorityRound(
      allWords,
      useProgressStore.getState().wordProgressMap,
      settings.roundSize,
      settings.selectedCategory,
    );
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
    if (!state.currentQuestion || state.result === 'correct' || state.showAnswer) return;
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
      set({ userInput: nextInput, result: null, feedbackMessage: undefined });
      if (shouldCheck) {
        const correct = isSpellingCorrect(fullWord, state.currentQuestion.answer);
        const nextAttemptCount = state.attemptCount + 1;
        if (correct) {
          useProgressStore.getState().recordResult(state.currentQuestion.wordId, true, state.mode);
          useProgressStore.getState().addStars(1);
          set({
            result: 'correct',
            stars: state.stars + 1,
            comboCount: state.comboCount + 1,
            attemptCount: nextAttemptCount,
            feedbackMessage: nextAttemptCount >= 3 ? '连对 3 题，超棒！' : '答对啦，真厉害！',
          });
        } else if (nextAttemptCount >= 2) {
          useProgressStore.getState().recordResult(state.currentQuestion.wordId, false, state.mode);
          set({
            result: 'wrong',
            showAnswer: true,
            comboCount: 0,
            attemptCount: nextAttemptCount,
            feedbackMessage: `答案是 ${state.currentQuestion.answer.toUpperCase()}`,
            wrongWordIds: Array.from(new Set([...state.wrongWordIds, state.currentQuestion.wordId])),
          });
        } else {
          set({
            userInput: '',
            result: null,
            comboCount: 0,
            attemptCount: nextAttemptCount,
            feedbackMessage: '差一点点，再试一次～',
          });
        }
      }
      return;
    }

    set({ userInput: nextInput, result: null, feedbackMessage: undefined });
    if (nextInput.length === state.currentQuestion.answer.length) {
      const correct = isSpellingCorrect(nextInput, state.currentQuestion.answer);
      const nextAttemptCount = state.attemptCount + 1;
      if (correct) {
        useProgressStore.getState().recordResult(state.currentQuestion.wordId, true, state.mode);
        useProgressStore.getState().addStars(1);
        set({
          result: 'correct',
          stars: state.stars + 1,
          comboCount: state.comboCount + 1,
          attemptCount: nextAttemptCount,
          feedbackMessage: state.comboCount + 1 >= 3 ? '连对 3 题，超棒！' : '答对啦，继续前进！',
        });
      } else if (nextAttemptCount >= 2) {
        useProgressStore.getState().recordResult(state.currentQuestion.wordId, false, state.mode);
        set({
          result: 'wrong',
          showAnswer: true,
          comboCount: 0,
          attemptCount: nextAttemptCount,
          feedbackMessage: `答案是 ${state.currentQuestion.answer.toUpperCase()}`,
          wrongWordIds: Array.from(new Set([...state.wrongWordIds, state.currentQuestion.wordId])),
        });
      } else {
        set({
          userInput: '',
          result: null,
          comboCount: 0,
          attemptCount: nextAttemptCount,
          feedbackMessage: '差一点点，再试一次～',
        });
      }
    }
  },
  removeLastLetter: () => {
    const state = get();
    if (state.result === 'correct' || state.showAnswer) return;
    set({ userInput: state.userInput.slice(0, -1), feedbackMessage: undefined });
  },
  selectOption: (option) => {
    const state = get();
    if (!state.currentQuestion || state.currentQuestion.mode !== 'e2c' || state.result === 'correct' || state.showAnswer) return;
    const correct = option === state.currentQuestion.answer;
    const nextAttemptCount = state.attemptCount + 1;

    if (correct) {
      useProgressStore.getState().recordResult(state.currentQuestion.wordId, true, state.mode);
      useProgressStore.getState().addStars(1);
      set({
        selectedOption: option,
        result: 'correct',
        stars: state.stars + 1,
        comboCount: state.comboCount + 1,
        attemptCount: nextAttemptCount,
        feedbackMessage: state.comboCount + 1 >= 3 ? '连对 3 题，超棒！' : '选对啦！',
      });
      return;
    }

    if (nextAttemptCount >= 2) {
      useProgressStore.getState().recordResult(state.currentQuestion.wordId, false, state.mode);
      set({
        selectedOption: option,
        result: 'wrong',
        showAnswer: true,
        comboCount: 0,
        attemptCount: nextAttemptCount,
        feedbackMessage: `正确答案是：${state.currentQuestion.answer}`,
        wrongWordIds: Array.from(new Set([...state.wrongWordIds, state.currentQuestion.wordId])),
      });
      return;
    }

    set({
      selectedOption: option,
      result: null,
      comboCount: 0,
      attemptCount: nextAttemptCount,
      feedbackMessage: '这个不对哦，再选一次～',
    });
  },
  showCorrectAnswer: () => {
    const state = get();
    set({
      showAnswer: true,
      comboCount: 0,
      result: state.result ?? 'wrong',
      feedbackMessage: state.currentQuestion ? `答案是 ${state.currentQuestion.answer.toUpperCase()}` : undefined,
    });
    if (state.currentQuestion) {
      useProgressStore.getState().recordResult(state.currentQuestion.wordId, false, state.mode);
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
      feedbackMessage: undefined,
      attemptCount: 0,
      completedWordIds,
    });
  },
  resetRound: () => set({ ...initialState }),
}));
