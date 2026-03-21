import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeaderBar } from '../components/game/HeaderBar';
import { LearningCard } from '../components/game/LearningCard';
import { WordCard } from '../components/game/WordCard';
import { ChoiceOptions } from '../components/game/ChoiceOptions';
import { LetterKeyboard } from '../components/game/LetterKeyboard';
import { InputSlots } from '../components/game/InputSlots';
import { CelebrationOverlay } from '../components/game/CelebrationOverlay';
import { playErrorTone, playSuccessTone, speakWord } from '../lib/audio';
import type { GameMode } from '../types/question';
import type { GameState } from '../types/game';

interface LearnPageProps {
  state: GameState;
  totalStars: number;
  disabledLetterIndexes: number[];
  soundEnabled: boolean;
  autoPlaySound: boolean;
  onPickLetter: (letter: string, index: number) => void;
  onDelete: () => void;
  onSelectOption: (option: string) => void;
  onShowAnswer: () => void;
  onNext: () => void;
  onStartPractice: () => void;
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
  soundEnabled,
  autoPlaySound,
  onPickLetter,
  onDelete,
  onSelectOption,
  onShowAnswer,
  onNext,
  onStartPractice,
}: LearnPageProps) {
  useEffect(() => {
    if (state.isLearningCard) return undefined;
    if (state.result === 'correct') {
      playSuccessTone(soundEnabled);
      if (autoPlaySound && state.currentWord?.english) {
        const wordToSpeak = state.currentWord.english;
        window.setTimeout(() => speakWord(wordToSpeak, soundEnabled), 120);
      }
      const timer = window.setTimeout(() => {
        onNext();
      }, 900);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [autoPlaySound, onNext, soundEnabled, state.currentWord?.english, state.result, state.roundIndex]);

  useEffect(() => {
    if (state.feedbackMessage && !state.showAnswer && state.result !== 'correct' && state.attemptCount > 0) {
      playErrorTone(soundEnabled);
    }
  }, [soundEnabled, state.attemptCount, state.feedbackMessage, state.result, state.showAnswer]);

  if (!state.currentWord) return null;

  const question = state.currentQuestion;
  const showNext = Boolean(state.result || state.showAnswer);
  const answerText = state.showAnswer ? `答案：${state.currentWord.english}` : undefined;
  const showCelebrate = state.result === 'correct';

  return (
    <div style={styles.wrap}>
      <CelebrationOverlay show={showCelebrate} comboCount={state.comboCount} />
      <HeaderBar stars={state.stars} modeLabel={modeLabelMap[state.mode]} totalStars={totalStars} />
      <div style={styles.progressRow}>
        <div style={styles.progressText}>第 {Math.min(state.roundIndex + 1, state.roundTotal)} / {state.roundTotal} 题</div>
        <div style={styles.rightTools}>
          <button
            type="button"
            style={styles.soundButton}
            onClick={() => speakWord(state.currentWord?.english ?? '', soundEnabled)}
          >
            🔊 读单词
          </button>
          <div style={styles.modeChip}>{mascotMap[state.mode]} {modeLabelMap[state.mode]}</div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={state.isLearningCard ? `card-${state.roundIndex}-${state.currentWord.id}` : `${state.roundIndex}-${question?.id}`}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.24 }}
          style={styles.stage}
        >
          {state.isLearningCard ? (
            <LearningCard
              english={state.currentWord.english}
              chinese={state.currentWord.chinese}
              soundEnabled={soundEnabled}
              onSpeak={() => speakWord(state.currentWord?.english ?? '', soundEnabled)}
              onStart={onStartPractice}
            />
          ) : question ? (
            <>
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
                  lockSelection={showNext}
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
            </>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {!state.isLearningCard && state.feedbackMessage ? (
        <motion.div
          style={{
            ...styles.hint,
            ...(state.result === 'correct' ? styles.successHint : {}),
            ...(state.showAnswer ? styles.answerHint : {}),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {state.feedbackMessage}
        </motion.div>
      ) : null}

      {!state.isLearningCard ? (
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
      ) : null}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 18, position: 'relative' },
  stage: { display: 'grid', gap: 18 },
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
  rightTools: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  soundButton: {
    minHeight: 38,
    padding: '0 12px',
    border: 'none',
    borderRadius: 999,
    background: '#ffffff',
    boxShadow: '0 8px 18px rgba(0,0,0,0.06)',
    fontWeight: 800,
    cursor: 'pointer',
    color: '#49575c',
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
  successHint: {
    color: '#13786f',
    background: '#eafffb',
  },
  answerHint: {
    color: '#7d5a00',
    background: '#fff6d8',
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
