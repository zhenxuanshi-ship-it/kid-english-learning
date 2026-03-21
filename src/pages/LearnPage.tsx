import type { CSSProperties } from 'react';
import { HeaderBar } from '../components/game/HeaderBar';
import { WordCard } from '../components/game/WordCard';
import { ChoiceOptions } from '../components/game/ChoiceOptions';
import { LetterKeyboard } from '../components/game/LetterKeyboard';
import { InputSlots } from '../components/game/InputSlots';
import type { GameMode } from '../types/question';
import type { GameState } from '../types/game';

interface LearnPageProps {
  state: GameState;
  totalStars: number;
  disabledLetterIndexes: number[];
  onPickLetter: (letter: string, index: number) => void;
  onDelete: () => void;
  onSelectOption: (option: string) => void;
  onShowAnswer: () => void;
  onNext: () => void;
}

const modeLabelMap: Record<GameMode, string> = {
  e2c: '英译中选择',
  c2e: '中译英拼写',
  spell_blank: '留空补全',
};

export function LearnPage({
  state,
  totalStars,
  disabledLetterIndexes,
  onPickLetter,
  onDelete,
  onSelectOption,
  onShowAnswer,
  onNext,
}: LearnPageProps) {
  if (!state.currentQuestion || !state.currentWord) return null;

  const question = state.currentQuestion;
  const showNext = Boolean(state.result || state.showAnswer);
  const answerText = state.showAnswer ? `答案：${state.currentWord.english}` : undefined;

  return (
    <div style={styles.wrap}>
      <HeaderBar stars={state.stars} modeLabel={modeLabelMap[state.mode]} totalStars={totalStars} />
      <WordCard title={question.prompt} subtitle={answerText} status={state.result}>
        {question.mode === 'e2c' ? null : (
          <InputSlots
            text={state.userInput}
            answerLength={question.mode === 'c2e' ? question.answer.length : undefined}
            pattern={question.mode === 'spell_blank' ? question.pattern : undefined}
            missingIndexes={question.mode === 'spell_blank' ? question.missingIndexes : undefined}
          />
        )}
      </WordCard>

      {question.mode === 'e2c' ? (
        <ChoiceOptions
          options={question.options}
          selected={state.selectedOption}
          answer={question.answer}
          onSelect={onSelectOption}
        />
      ) : (
        <LetterKeyboard
          letters={question.letterPool}
          disabledLetters={disabledLetterIndexes}
          onPick={onPickLetter}
          onDelete={onDelete}
        />
      )}

      {state.result === 'wrong' && !state.showAnswer ? <div style={styles.hint}>差一点点，再试试看～ 或者直接看答案 👀</div> : null}

      <div style={styles.actions}>
        <button style={styles.answer} onClick={onShowAnswer}>看答案 👀</button>
        <button style={{ ...styles.next, opacity: showNext ? 1 : 0.5 }} onClick={onNext} disabled={!showNext}>下一题</button>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 18 },
  hint: {
    textAlign: 'center',
    color: '#ff7675',
    fontWeight: 700,
  },
  actions: { display: 'flex', gap: 12 },
  answer: {
    flex: 1,
    minHeight: 54,
    border: 'none',
    borderRadius: 18,
    background: '#ffe66d',
    fontWeight: 900,
    cursor: 'pointer',
  },
  next: {
    flex: 1,
    minHeight: 54,
    border: 'none',
    borderRadius: 18,
    background: '#ff6b6b',
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
  },
};
