import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SentenceLearnPage } from './SentenceLearnPage';
import type { SentenceExercise, SentenceExerciseMode } from '../types/sentence';
import type { Word } from '../types/word';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock('../lib/audio', () => ({
  speakWord: vi.fn(),
}));

vi.mock('../components/common/WordVisual', () => ({
  // WordVisual renders image or emoji, not text - use placeholder in tests
  WordVisual: () => <span>🖼</span>,
}));

const makeExercise = (overrides: Partial<SentenceExercise> = {}): SentenceExercise => ({
  id: 'ex-1',
  patternId: 'this_is',
  mode: 'choose_word' as SentenceExerciseMode,
  prompt: 'Complete the sentence',
  chinese: '这是一只猫',
  english: 'This is a cat',
  answer: 'cat',
  options: ['cat', 'dog', 'bird'],
  tokens: undefined,
  ...overrides,
});

const makeWord = (overrides: Partial<Word> = {}): Word => ({
  id: 1,
  english: 'cat',
  chinese: '猫',
  category: 'animals',
  audioUrl: undefined,
  imageUrl: undefined,
  ...overrides,
});

describe('SentenceLearnPage', () => {
  it('renders exercise prompt', () => {
    render(<SentenceLearnPage
      exercise={makeExercise({ prompt: 'Pick the right word' })}
      roundIndex={0}
      roundTotal={5}
      arrangedTokens={[]}
      linkedWords={[]}
      soundEnabled={true}
      onSelectAnswer={vi.fn()}
      onArrangeTokens={vi.fn()}
      onUndoArrange={vi.fn()}
      onNext={vi.fn()}
    />);
    expect(screen.getByText('Pick the right word')).toBeInTheDocument();
  });

  it('renders progress counter', () => {
    render(<SentenceLearnPage
      exercise={makeExercise()}
      roundIndex={2}
      roundTotal={10}
      arrangedTokens={[]}
      linkedWords={[]}
      soundEnabled={true}
      onSelectAnswer={vi.fn()}
      onArrangeTokens={vi.fn()}
      onUndoArrange={vi.fn()}
      onNext={vi.fn()}
    />);
    expect(screen.getByText('第 3 / 10 题')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<SentenceLearnPage
      exercise={makeExercise()}
      roundIndex={0}
      roundTotal={5}
      arrangedTokens={[]}
      linkedWords={[]}
      soundEnabled={true}
      onSelectAnswer={vi.fn()}
      onArrangeTokens={vi.fn()}
      onUndoArrange={vi.fn()}
      onNext={vi.fn()}
    />);
    expect(screen.getByText('cat')).toBeInTheDocument();
    expect(screen.getByText('dog')).toBeInTheDocument();
    expect(screen.getByText('bird')).toBeInTheDocument();
  });

  it('calls onSelectAnswer when option clicked', () => {
    const onSelectAnswer = vi.fn();
    render(<SentenceLearnPage
      exercise={makeExercise()}
      roundIndex={0}
      roundTotal={5}
      arrangedTokens={[]}
      linkedWords={[]}
      soundEnabled={true}
      onSelectAnswer={onSelectAnswer}
      onArrangeTokens={vi.fn()}
      onUndoArrange={vi.fn()}
      onNext={vi.fn()}
    />);
    fireEvent.click(screen.getByText('cat'));
    expect(onSelectAnswer).toHaveBeenCalledWith('cat');
  });

  it('renders linked words', () => {
    render(<SentenceLearnPage
      exercise={makeExercise()}
      roundIndex={0}
      roundTotal={5}
      arrangedTokens={[]}
      linkedWords={[makeWord({ id: 'w-1', english: 'apple' }), makeWord({ id: 'w-2', english: 'banana' })]}
      soundEnabled={true}
      onSelectAnswer={vi.fn()}
      onArrangeTokens={vi.fn()}
      onUndoArrange={vi.fn()}
      onNext={vi.fn()}
    />);
    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText('banana')).toBeInTheDocument();
  });

  it('renders reorder mode with tokens', () => {
    render(<SentenceLearnPage
      exercise={makeExercise({ mode: 'reorder_words', tokens: ['This', 'is', 'a', 'cat'] })}
      roundIndex={0}
      roundTotal={5}
      arrangedTokens={[]}
      linkedWords={[]}
      soundEnabled={true}
      onSelectAnswer={vi.fn()}
      onArrangeTokens={vi.fn()}
      onUndoArrange={vi.fn()}
      onNext={vi.fn()}
    />);
    expect(screen.getByText('This')).toBeInTheDocument();
    expect(screen.getByText('is')).toBeInTheDocument();
    expect(screen.getByText('把词卡按顺序点进来')).toBeInTheDocument();
  });

  it('shows feedback when isCorrect is set', () => {
    render(<SentenceLearnPage
      exercise={makeExercise()}
      roundIndex={0}
      roundTotal={5}
      arrangedTokens={[]}
      linkedWords={[]}
      soundEnabled={true}
      isCorrect={true}
      onSelectAnswer={vi.fn()}
      onArrangeTokens={vi.fn()}
      onUndoArrange={vi.fn()}
      onNext={vi.fn()}
    />);
    expect(screen.getByText('答对啦！你的小句子拼好了 🌟')).toBeInTheDocument();
  });

  it('shows wrong feedback', () => {
    render(<SentenceLearnPage
      exercise={makeExercise()}
      roundIndex={0}
      roundTotal={5}
      arrangedTokens={[]}
      linkedWords={[]}
      soundEnabled={true}
      isCorrect={false}
      onSelectAnswer={vi.fn()}
      onArrangeTokens={vi.fn()}
      onUndoArrange={vi.fn()}
      onNext={vi.fn()}
    />);
    expect(screen.getByText(/差一点点/)).toBeInTheDocument();
  });

  it('next button is disabled when isCorrect not set', () => {
    render(<SentenceLearnPage
      exercise={makeExercise()}
      roundIndex={0}
      roundTotal={5}
      arrangedTokens={[]}
      linkedWords={[]}
      soundEnabled={true}
      onSelectAnswer={vi.fn()}
      onArrangeTokens={vi.fn()}
      onUndoArrange={vi.fn()}
      onNext={vi.fn()}
    />);
    const nextBtn = screen.getByText('下一题 ➜');
    expect(nextBtn).toBeDisabled();
  });

  it('next button is enabled when isCorrect is set', () => {
    render(<SentenceLearnPage
      exercise={makeExercise()}
      roundIndex={0}
      roundTotal={5}
      arrangedTokens={[]}
      linkedWords={[]}
      soundEnabled={true}
      isCorrect={true}
      onSelectAnswer={vi.fn()}
      onArrangeTokens={vi.fn()}
      onUndoArrange={vi.fn()}
      onNext={vi.fn()}
    />);
    const nextBtn = screen.getByText('下一题 ➜');
    expect(nextBtn).not.toBeDisabled();
  });

  it('calls onNext when next button clicked', () => {
    const onNext = vi.fn();
    render(<SentenceLearnPage
      exercise={makeExercise()}
      roundIndex={0}
      roundTotal={5}
      arrangedTokens={[]}
      linkedWords={[]}
      soundEnabled={true}
      isCorrect={true}
      onSelectAnswer={vi.fn()}
      onArrangeTokens={vi.fn()}
      onUndoArrange={vi.fn()}
      onNext={onNext}
    />);
    fireEvent.click(screen.getByText('下一题 ➜'));
    expect(onNext).toHaveBeenCalled();
  });

  it('returns null when exercise is null', () => {
    const { container } = render(<SentenceLearnPage
      exercise={null}
      roundIndex={0}
      roundTotal={5}
      arrangedTokens={[]}
      linkedWords={[]}
      soundEnabled={true}
      onSelectAnswer={vi.fn()}
      onArrangeTokens={vi.fn()}
      onUndoArrange={vi.fn()}
      onNext={vi.fn()}
    />);
    expect(container).toBeEmptyDOMElement();
  });
});
