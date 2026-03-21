import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from './gameStore';
import { useProgressStore } from './progressStore';
import { useSettingsStore } from './settingsStore';

describe('gameStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useProgressStore.setState({
      totalStars: 0,
      currentMode: 'e2c',
      learnedWordIds: [],
      wordProgressMap: {},
      lastStudyDate: undefined,
    });
    useSettingsStore.setState({
      roundSize: 5,
      selectedCategory: 'all',
      autoPlaySound: false,
      soundEnabled: false,
    });
    useGameStore.setState({
      mode: 'e2c',
      currentWord: null,
      currentQuestion: null,
      isLearningCard: false,
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
    });
  });

  it('starts a round with a learning card for new words', () => {
    useGameStore.getState().startRound('e2c');
    const state = useGameStore.getState();
    expect(state.currentQuestion).toBeNull();
    expect(state.currentWord).toBeTruthy();
    expect(state.isLearningCard).toBe(true);
    expect(state.roundWordIds.length).toBe(5);
  });

  it('awards a star for a correct e2c answer', () => {
    useGameStore.getState().startRound('e2c', [11, 12, 13, 14, 15]);
    useGameStore.getState().startPractice();
    const answer = useGameStore.getState().currentQuestion?.answer;
    useGameStore.getState().selectOption(answer as string);
    const state = useGameStore.getState();
    expect(state.result).toBe('correct');
    expect(state.stars).toBe(1);
  });

  it('shows answer after two wrong e2c attempts', () => {
    useGameStore.getState().startRound('e2c', [11, 12, 13, 14, 15]);
    useGameStore.getState().startPractice();
    const current = useGameStore.getState().currentQuestion;
    if (!current || current.mode !== 'e2c') throw new Error('Expected e2c question');
    const wrongOptions = current.options.filter((option) => option !== current.answer);
    useGameStore.getState().selectOption(wrongOptions[0]);
    expect(useGameStore.getState().showAnswer).toBe(false);
    useGameStore.getState().selectOption(wrongOptions[1]);
    expect(useGameStore.getState().showAnswer).toBe(true);
    expect(useGameStore.getState().result).toBe('wrong');
  });

  it('shows answer after two wrong spelling attempts', () => {
    useProgressStore.setState({
      ...useProgressStore.getState(),
      currentMode: 'c2e',
      wordProgressMap: {
        1: {
          wordId: 1,
          seenCount: 2,
          correctCount: 2,
          wrongCount: 0,
          mastered: false,
          learningStage: 'practicing',
        },
      },
    });
    useGameStore.getState().startRound('c2e', [1, 2, 3, 4, 5]); // cat
    const firstTry = ['x', 'y', 'z'];
    firstTry.forEach((letter) => useGameStore.getState().inputLetter(letter));
    expect(useGameStore.getState().showAnswer).toBe(false);
    const secondTry = ['q', 'w', 'e'];
    secondTry.forEach((letter) => useGameStore.getState().inputLetter(letter));
    expect(useGameStore.getState().showAnswer).toBe(true);
    expect(useGameStore.getState().result).toBe('wrong');
  });

  it('moves to the next question', () => {
    useGameStore.getState().startRound('e2c', [11, 12, 13, 14, 15]);
    useGameStore.getState().startPractice();
    const firstWordId = useGameStore.getState().currentWord?.id;
    const answer = useGameStore.getState().currentQuestion?.answer;
    useGameStore.getState().selectOption(answer as string);
    useGameStore.getState().nextQuestion();
    const state = useGameStore.getState();
    expect(state.roundIndex).toBe(1);
    expect(state.currentWord?.id).not.toBe(firstWordId);
  });

  it('falls back to an allowed mode for new words when preferred mode is too hard', () => {
    useProgressStore.getState().setMode('spell_blank');
    useGameStore.getState().startRound('spell_blank', [1, 2, 3, 4, 5]);
    expect(useGameStore.getState().isLearningCard).toBe(true);
    useGameStore.getState().startPractice();
    const state = useGameStore.getState();
    expect(state.mode).toBe('e2c');
    expect(state.currentQuestion?.mode).toBe('e2c');
  });
});
