import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { WordVisual } from '../components/common/WordVisual';
import type { SentenceExercise } from '../types/sentence';
import type { Word } from '../types/word';

interface SentenceLearnPageProps {
  exercise: SentenceExercise | null;
  roundIndex: number;
  roundTotal: number;
  selectedAnswer?: string;
  arrangedTokens: string[];
  linkedWords: Word[];
  isCorrect?: boolean;
  onSelectAnswer: (answer: string) => void;
  onArrangeTokens: (tokens: string[]) => void;
  onUndoArrange: () => void;
  onNext: () => void;
}

export function SentenceLearnPage({
  exercise,
  roundIndex,
  roundTotal,
  selectedAnswer,
  arrangedTokens,
  linkedWords,
  isCorrect,
  onSelectAnswer,
  onArrangeTokens,
  onUndoArrange,
  onNext,
}: SentenceLearnPageProps) {
  if (!exercise) return null;

  const showNext = typeof isCorrect === 'boolean';

  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.topBar}>
        <div style={styles.progress}>第 {Math.min(roundIndex + 1, roundTotal)} / {roundTotal} 题</div>
        <div style={styles.modeTag}>{modeLabelMap[exercise.mode]}</div>
      </div>

      <div style={styles.card}>
        <div style={styles.mascot}>🪄 跟着句子小精灵，一步步来</div>
        <div style={styles.prompt}>{exercise.prompt ?? '完成这个小句子'}</div>
        <div style={styles.chinese}>{exercise.chinese}</div>

        {linkedWords.length > 0 ? (
          <div style={styles.linkedWordsCard}>
            <div style={styles.linkedWordsTitle}>这句用到了这些词</div>
            <div style={styles.linkedWordsGrid}>
              {linkedWords.map((word) => (
                <div key={word.id} style={styles.linkedWordItem}>
                  <WordVisual word={word} size="sm" />
                  <div style={styles.linkedWordEnglish}>{word.english}</div>
                  <div style={styles.linkedWordChinese}>{word.chinese}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {(exercise.mode === 'choose_word' || exercise.mode === 'match_sentence') && exercise.options ? (
          <div style={styles.options}>
            {exercise.options.map((option) => {
              const active = selectedAnswer === option;
              const correct = showNext && option === exercise.answer;
              const wrong = showNext && active && option !== exercise.answer;
              return (
                <button
                  key={option}
                  style={{
                    ...styles.option,
                    ...(active ? styles.optionActive : {}),
                    ...(correct ? styles.optionCorrect : {}),
                    ...(wrong ? styles.optionWrong : {}),
                  }}
                  onClick={() => onSelectAnswer(option)}
                  disabled={showNext}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : null}

        {exercise.mode === 'reorder_words' && exercise.tokens ? (
          <>
            <div style={styles.answerTray}>
              {arrangedTokens.length > 0 ? arrangedTokens.join(' ') : '把词卡按顺序点进来'}
            </div>
            <div style={styles.reorderTools}>
              <div style={styles.reorderHint}>先点词卡，再看看句子顺不顺。</div>
              <button style={{ ...styles.undoButton, opacity: arrangedTokens.length > 0 && !showNext ? 1 : 0.5 }} disabled={arrangedTokens.length === 0 || showNext} onClick={onUndoArrange}>撤回上一个</button>
            </div>
            <div style={styles.tokens}>
              {exercise.tokens.map((token) => {
                const usedCount = arrangedTokens.filter((item) => item === token).length;
                const availableCount = exercise.tokens?.filter((item) => item === token).length ?? 0;
                const disabled = usedCount >= availableCount || showNext;
                return (
                  <button key={`${token}-${usedCount}`} style={{ ...styles.token, ...(disabled ? styles.tokenDisabled : {}) }} disabled={disabled} onClick={() => onArrangeTokens([...arrangedTokens, token])}>
                    {token}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {showNext ? <div style={{ ...styles.feedback, ...(isCorrect ? styles.feedbackOk : styles.feedbackBad) }}>{isCorrect ? '答对啦！你的小句子拼好了 🌟' : `差一点点，再看看：${exercise.english}`}</div> : null}

        <button style={{ ...styles.next, opacity: showNext ? 1 : 0.5 }} disabled={!showNext} onClick={onNext}>下一题 ➜</button>
      </div>
    </motion.div>
  );
}

const modeLabelMap = {
  choose_word: '选词补句',
  match_sentence: '选对句子',
  reorder_words: '句子排序',
} as const;

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 12 },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  progress: { fontSize: 14, fontWeight: 800, color: '#66757b' },
  modeTag: { padding: '8px 12px', borderRadius: 999, background: '#fff', fontSize: 13, fontWeight: 800 },
  card: {
    background: 'linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)',
    borderRadius: 24,
    padding: 18,
    display: 'grid',
    gap: 12,
    boxShadow: '0 14px 26px rgba(124, 92, 255, 0.08)',
  },
  mascot: { fontSize: 13, fontWeight: 900, color: '#7c5cff' },
  prompt: { fontSize: 22, fontWeight: 900, color: '#374349' },
  chinese: { fontSize: 14, fontWeight: 700, color: '#66757b' },
  linkedWordsCard: {
    background: '#fff',
    borderRadius: 18,
    padding: 12,
    display: 'grid',
    gap: 10,
    boxShadow: '0 8px 16px rgba(0,0,0,0.04)',
  },
  linkedWordsTitle: { fontSize: 13, fontWeight: 900, color: '#5a4bcc' },
  linkedWordsGrid: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  linkedWordItem: { width: 72, display: 'grid', gap: 4, justifyItems: 'center', textAlign: 'center' },
  linkedWordEnglish: { fontSize: 12, fontWeight: 900, color: '#384349' },
  linkedWordChinese: { fontSize: 11, fontWeight: 700, color: '#7b8890' },
  options: { display: 'grid', gap: 8 },
  option: {
    minHeight: 48,
    border: 'none',
    borderRadius: 16,
    background: '#fff',
    textAlign: 'left',
    padding: '0 14px',
    fontWeight: 800,
    boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
  },
  optionActive: { outline: '2px solid #7c5cff' },
  optionCorrect: { background: '#e8fff7', color: '#157a6e' },
  optionWrong: { background: '#fff1f1', color: '#d9485f' },
  answerTray: {
    minHeight: 48,
    borderRadius: 16,
    background: '#f5f2ff',
    padding: '12px 14px',
    fontWeight: 800,
    color: '#5a4bcc',
  },
  reorderTools: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  reorderHint: { fontSize: 13, fontWeight: 700, color: '#66757b' },
  undoButton: {
    minHeight: 38,
    padding: '0 12px',
    border: '1px solid #ece8ff',
    borderRadius: 999,
    background: '#fff',
    color: '#5a4bcc',
    fontWeight: 800,
  },
  tokens: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  token: {
    minHeight: 42,
    padding: '0 14px',
    border: 'none',
    borderRadius: 999,
    background: '#fff',
    fontWeight: 800,
    boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
  },
  tokenDisabled: { opacity: 0.45 },
  feedback: { borderRadius: 16, padding: '10px 12px', fontWeight: 900, textAlign: 'center' },
  feedbackOk: { background: '#e8fff7', color: '#157a6e' },
  feedbackBad: { background: '#fff1f1', color: '#d9485f' },
  next: {
    minHeight: 50,
    border: 'none',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #7c5cff, #9b83ff)',
    color: '#fff',
    fontWeight: 900,
    fontSize: 16,
  },
};
