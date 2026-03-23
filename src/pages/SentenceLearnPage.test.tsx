import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SentenceLearnPage } from './SentenceLearnPage';
import type { SentenceExercise, SentenceExerciseMode } from '../types/sentence';
import type { Word } from '../types/word';

vi.mock('framer-motion', () => ({
  motion: { div: ({ children }: { children: React.ReactNode }) => <div>{children}</div> },
}));

vi.mock('../lib/audio', () => ({ speakWord: vi.fn() }));

vi.mock('../components/common/WordVisual', () => ({
  WordVisual: ({ word }: { word: Word }) => <div>{word.english}</div>,
}));

const makeExercise = (mode: SentenceExerciseMode = 'choose_word', opts: Partial<SentenceExercise> = {}) => ({
  id: 'ex-1',
  patternId: 'this_is',
  mode,
  prompt: 'Pick the right word',
  chinese: '这是一只猫',
  english: 'This is a cat',
  answer: 'cat',
  options: ['cat', 'dog', 'bird'],
  tokens: mode === 'reorder_words' ? ['This', 'is', 'a', 'cat'] : undefined,
  ...opts,
} as SentenceExercise);

const makeWord = (id: number, english: string) => ({
  id,
  english,
  chinese: '测试',
  category: 'animals',
  level: 1,
  difficulty: 1,
} as Word);

describe('SentenceLearnPage', () => {
  const defaultProps = {
    roundIndex: 0,
    roundTotal: 5,
    arrangedTokens: [] as string[],
    linkedWords: [] as Word[],
    soundEnabled: true,
    onSelectAnswer: vi.fn(),
    onArrangeTokens: vi.fn(),
    onUndoArrange: vi.fn(),
    onNext: vi.fn(),
  };

  it('renders prompt', () => {
    render(<SentenceLearnPage {...defaultProps} exercise={makeExercise('choose_word', { prompt: 'Choose wisely' })} />);
    expect(screen.getByText('Choose wisely')).toBeInTheDocument();
  });

  it('renders progress', () => {
    render(<SentenceLearnPage {...defaultProps} roundIndex={2} roundTotal={10} exercise={makeExercise()} />);
    expect(screen.getByText('第 3 / 10 题')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<SentenceLearnPage {...defaultProps} exercise={makeExercise()} />);
    expect(screen.getByText('cat')).toBeInTheDocument();
    expect(screen.getByText('dog')).toBeInTheDocument();
  });

  it('calls onSelectAnswer when option clicked', () => {
    const onSelectAnswer = vi.fn();
    render(<SentenceLearnPage {...defaultProps} onSelectAnswer={onSelectAnswer} exercise={makeExercise()} />);
    fireEvent.click(screen.getByText('cat'));
    expect(onSelectAnswer).toHaveBeenCalledWith('cat');
  });

  it('renders linked words', () => {
    const words = [makeWord(1, 'apple'), makeWord(2, 'banana')];
    render(<SentenceLearnPage {...defaultProps} linkedWords={words} exercise={makeExercise()} />);
    expect(screen.getAllByText('apple').length).toBeGreaterThan(0);
    expect(screen.getAllByText('banana').length).toBeGreaterThan(0);
  });

  it('renders reorder tokens', () => {
    render(<SentenceLearnPage {...defaultProps} exercise={makeExercise('reorder_words')} />);
    expect(screen.getByText('This')).toBeInTheDocument();
    expect(screen.getByText('is')).toBeInTheDocument();
    expect(screen.getByText('把词卡按顺序点进来')).toBeInTheDocument();
  });

  it('shows correct feedback', () => {
    render(<SentenceLearnPage {...defaultProps} isCorrect={true} exercise={makeExercise()} />);
    expect(screen.getByText('答对啦！你的小句子拼好了 🌟')).toBeInTheDocument();
  });

  it('shows wrong feedback', () => {
    render(<SentenceLearnPage {...defaultProps} isCorrect={false} exercise={makeExercise()} />);
    expect(screen.getByText(/差一点点/)).toBeInTheDocument();
  });

  it('next button disabled when no answer yet', () => {
    render(<SentenceLearnPage {...defaultProps} exercise={makeExercise()} />);
    expect(screen.getByText('下一题 ➜')).toBeDisabled();
  });

  it('next button enabled after answer', () => {
    render(<SentenceLearnPage {...defaultProps} isCorrect={true} exercise={makeExercise()} />);
    expect(screen.getByText('下一题 ➜')).not.toBeDisabled();
  });

  it('calls onNext when next button clicked', () => {
    const onNext = vi.fn();
    render(<SentenceLearnPage {...defaultProps} isCorrect={true} onNext={onNext} exercise={makeExercise()} />);
    fireEvent.click(screen.getByText('下一题 ➜'));
    expect(onNext).toHaveBeenCalled();
  });

  it('returns null when exercise is null', () => {
    const { container } = render(<SentenceLearnPage {...defaultProps} exercise={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
