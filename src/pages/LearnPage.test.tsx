import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LearnPage } from './LearnPage';

describe('LearnPage', () => {
  const baseWord = {
    id: 1,
    english: 'cat',
    chinese: '猫',
    category: 'animals',
    level: 1 as const,
    difficulty: 1,
    emoji: '🐱',
  };

  it('renders learning card for new words', () => {
    render(
      <LearnPage
        state={{
          mode: 'e2c',
          currentWord: baseWord,
          currentQuestion: null,
          isLearningCard: true,
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
          roundWordIds: [1],
          roundStartStages: { 1: 'new' },
          wrongWordIds: [],
          completedWordIds: [],
        }}
        totalStars={0}
        disabledLetterIndexes={[]}
        soundEnabled={false}
        autoPlaySound={false}
        onPickLetter={vi.fn()}
        onDelete={vi.fn()}
        onSelectOption={vi.fn()}
        onShowAnswer={vi.fn()}
        onNext={vi.fn()}
        onStartPractice={vi.fn()}
      />,
    );

    expect(screen.getByText('新单词先认识一下')).toBeInTheDocument();
    expect(screen.getByText('我记住了，开始练习')).toBeInTheDocument();
  });

  it('renders question flow and handles answer button click', () => {
    const onShowAnswer = vi.fn();
    render(
      <LearnPage
        state={{
          mode: 'e2c',
          currentWord: baseWord,
          currentQuestion: {
            id: 'e2c-1',
            mode: 'e2c',
            wordId: 1,
            prompt: 'cat',
            options: ['猫', '狗', '鱼', '鸟'],
            answer: '猫',
          },
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
          roundWordIds: [1],
          roundStartStages: { 1: 'learning' },
          wrongWordIds: [],
          completedWordIds: [],
        }}
        totalStars={0}
        disabledLetterIndexes={[]}
        soundEnabled={false}
        autoPlaySound={false}
        onPickLetter={vi.fn()}
        onDelete={vi.fn()}
        onSelectOption={vi.fn()}
        onShowAnswer={onShowAnswer}
        onNext={vi.fn()}
        onStartPractice={vi.fn()}
      />,
    );

    expect(screen.getByText('cat')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '看答案 👀' }));
    expect(onShowAnswer).toHaveBeenCalled();
  });
});
