import { beforeEach, describe, expect, it } from 'vitest';
import { useSentenceGameStore } from './sentenceGameStore';
import { useSentenceProgressStore } from './sentenceProgressStore';

describe('sentenceGameStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSentenceProgressStore.setState({ progressMap: {} as Partial<Record<import('../types/sentence').SentencePatternId, import('../types/sentence').SentenceProgress>> });
    useSentenceGameStore.setState({
      currentPatternId: undefined,
      round: [],
      roundIndex: 0,
      currentExercise: null,
      selectedAnswer: undefined,
      arrangedTokens: [],
      isCorrect: undefined,
      completed: false,
    });
  });

  it('starts a sentence round', () => {
    useSentenceGameStore.getState().startRound('this_is');
    expect(useSentenceGameStore.getState().currentExercise?.patternId).toBe('this_is');
  });

  it('checks choose-word answers', () => {
    useSentenceGameStore.getState().startRound('this_is');
    useSentenceGameStore.getState().selectAnswer('cat');
    expect(useSentenceGameStore.getState().isCorrect).toBe(true);
  });

  it('checks reorder token answers', () => {
    useSentenceGameStore.getState().startRound('i_like');
    useSentenceGameStore.getState().nextExercise();
    useSentenceGameStore.getState().nextExercise();
    useSentenceGameStore.getState().arrangeTokens(['I', 'like', 'watermelon']);
    expect(useSentenceGameStore.getState().isCorrect).toBe(true);
  });

  it('can undo arranged tokens before submit', () => {
    useSentenceGameStore.getState().startRound('i_like');
    useSentenceGameStore.getState().nextExercise();
    useSentenceGameStore.getState().nextExercise();
    useSentenceGameStore.getState().arrangeTokens(['I', 'like']);
    useSentenceGameStore.getState().undoArrangeToken();
    expect(useSentenceGameStore.getState().arrangedTokens).toEqual(['I']);
    expect(useSentenceGameStore.getState().isCorrect).toBeUndefined();
  });
});
