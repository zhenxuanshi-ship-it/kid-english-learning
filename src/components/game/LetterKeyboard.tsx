import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface LetterKeyboardProps {
  letters: string[];
  disabledLetters: number[];
  onPick: (letter: string, index: number) => void;
  onDelete: () => void;
}

export function LetterKeyboard({ letters, disabledLetters, onPick, onDelete }: LetterKeyboardProps) {
  return (
    <div style={styles.wrap}>
      <div style={styles.tip}>点一点字母，把单词拼出来 ✨</div>
      <div style={styles.grid}>
        {letters.map((letter, index) => {
          const disabled = disabledLetters.includes(index);
          return (
            <motion.button
              key={`${letter}-${index}`}
              style={{ ...styles.key, ...(disabled ? styles.disabled : {}) }}
              onClick={() => onPick(letter, index)}
              disabled={disabled}
              whileTap={{ scale: 0.94 }}
              whileHover={disabled ? undefined : { y: -2 }}
            >
              {letter.toUpperCase()}
            </motion.button>
          );
        })}
      </div>
      <button style={styles.delete} onClick={onDelete}>← 删除一个</button>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 12 },
  tip: {
    textAlign: 'center',
    color: '#636e72',
    fontWeight: 700,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    gap: 10,
  },
  key: {
    minHeight: 56,
    border: 'none',
    borderRadius: 18,
    background: 'linear-gradient(180deg, #ffe66d, #ffd95c)',
    color: '#2d3436',
    fontWeight: 900,
    fontSize: 18,
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(255, 217, 92, 0.35)',
  },
  disabled: {
    opacity: 0.38,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  delete: {
    minHeight: 56,
    border: 'none',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #ff7675, #ff9f9f)',
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(255, 118, 117, 0.28)',
  },
};
