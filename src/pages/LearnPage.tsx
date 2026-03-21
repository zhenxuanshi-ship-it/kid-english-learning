import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
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

const mascotMap: Record<GameMode, string> = {
  e2c: '🌈',
  c2e: '✏️',
  spell_blank: '🧩',
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
      <div style={styles.progressRow}>
        <div style={styles.progressText}>第 {Math.min(state.roundIndex + 1, state.roundTotal)} / {state.roundTotal} 题</div>
        <div style={styles.modeChip}>{mascotMap[state.mode]} {modeLabelMap[state.mode]}</div>
      </div>
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

      {state.result === 'wrong' && !state.showAnswer ? (
        <motion.div style={styles.hint} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          差一点点，再试试看～ 或者直接看答案 👀
        </motion.div>
      ) : null}

      <div style={styles.actions}>
        <motion.button style={styles.answer} onClick={onShowAnswer} whileTap={{ scale: 0.97 }}>
          看答案 👀
        </motion.button>
        <motion.button
          style={{ ...styles.next, opacity: showNext ? 1 : 0.5 }}
          onClick={onNext}
          disabled={!showNext}
          whileTap={{ scale: showNext ? 0.97 : 1 }}
        >
          下一题 ➜
        </motion.button>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 18 },
  progressRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  progressText: {
    color: '#6b7a80',
    fontWeight: 800,
    fontSize: 15,
  },
  modeChip: {
    padding: '8px 12px',
    borderRadius: 999,
    background: '#ffffff',
    boxShadow: '0 8px 18px rgba(0,0,0,0.06)',
    fontWeight: 800,
    color: '#49575c',
  },
  hint: {
    textAlign: 'center',
    color: '#ff7675',
    fontWeight: 800,
    background: '#fff0f0',
    borderRadius: 16,
    padding: '10px 14px',
  },
  actions: { display: 'flex', gap: 12 },
  answer: {
    flex: 1,
    minHeight: 56,
    border: 'none',
    borderRadius: 20,
    background: 'linear-gradient(135deg, #ffe66d, #ffd95c)',
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 12px 22px rgba(255, 217, 92, 0.24)',
  },
  next: {
    flex: 1,
    minHeight: 56,
    border: 'none',
    borderRadius: 20,
    background: 'linear-gradient(135deg, #ff6b6b, #ff8e7b)',
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 14px 24px rgba(255, 107, 107, 0.24)',
  },
};
